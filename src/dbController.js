// DB Controller Code

const { getConnection } = require('./db');
const {sendWhatsAppMessage}= require('./utils');
const moment = require('moment');  

// Fetch all menu actions based on parent menu ID
function fetchMenuAction(menuID = null, parentMenuID = null) {
    return new Promise((resolve, reject) => {
        let query;
        let params;

        if (parentMenuID !== null) {
            query = `SELECT * FROM Menu WHERE Parent_Menu_ID = ?`;
            params = [parentMenuID];
        } else if (menuID !== null) {
            query = `SELECT * FROM Menu WHERE Menu_ID = ?`;
            params = [menuID];
        } else {
            reject(new Error('No valid Menu ID or Parent Menu ID provided.'));
            return;
        }

        const connection = getConnection();
        console.log();
        connection.execute(query, params, (err, results) => {
            if (err) {
                console.error('Error fetching menu actions:', err.message);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function fetchEmergencyReasons() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Value_name FROM List WHERE Key_name = "EMERGENCY_REASON" ORDER BY Display_Order';
        const connection = getConnection();

        connection.execute(query, (err, results) => {
            if (err) {
                console.error('Error fetching emergency reasons:', err.message);
                reject(err);
            } else {
                // Map results to extract the value names
                const emergencyReasons = results.map(row => row.Value_name);
                resolve(emergencyReasons); 
            }
        });
    });
}

async function getMenuNameFromParentMenuName(parentMenuName) {  
    
    return new Promise((resolve, reject) => {  
     const query = `SELECT Menu_Name FROM Menu WHERE Parent_Menu_ID = (SELECT Menu_ID FROM Menu WHERE Menu_Name = ?) LIMIT 1`;  
     const connection = getConnection();  
    
     connection.execute(query, [parentMenuName], (err, results) => {  
      if (err) {  
        console.error('Error fetching emergency reasons:', err.message);  
        reject(err);  
      } else {  
        // Map results to extract the value names  
        const menuName = results[0].Menu_Name;  
        console.log(menuName);  
        resolve(menuName);  
      }  
     });  
    });  
  }

  async function insertAppointmentAndUser(from, userState) {   
    try {   
      if(userState[from].type=='emergency')  
      {  
       const connection = getConnection();   
       const query = `INSERT INTO Users (User_Name, User_Contact, User_Email, User_Location) VALUES (?, ?, ?, ?)`;   
       const params = [userState[from].name, from, '', userState[from].location];   
     
       connection.execute(query, params, (err, results) => {   
        if (err) {   
          console.error('Error inserting user:', err.message);   
          throw err;   
        } else {   
          const userId = results.insertId;   
          const appointmentQuery = `INSERT INTO Appointments (Client_ID, User_ID, Appointment_Date, User_Location, User_Name, Appointment_Type) VALUES (?, ?, ?, ?, ?, ?)`;   
          const appointmentParams = [1, userId, new Date(), userState[from].location, userState[from].name, userState[from].type];   
     
          connection.execute(appointmentQuery, appointmentParams, (err, results) => {   
            if (err) {   
             console.error('Error inserting appointment:', err.message);   
             throw err;   
            } else {   
             const appointmentId = results.insertId;   
             const reply = `We are waiting for your arrival. Your appointment ID is ${appointmentId}.`;   
             sendWhatsAppMessage(from, reply);   
            }   
          });   
        }   
       });   
      } 
      else if(userState[from].type=='Direct Consultation')  
        {  
          const connection = getConnection();    
          const query = `INSERT INTO Users (User_Name, User_Contact, User_Email, User_Location) VALUES (?, ?, ?, ?)`;    
          const params = [userState[from].name, userState[from].phone_number, userState[from].email, ''];    
          
          connection.execute(query, params, (err, results) => {    
           if (err) {    
            console.error('Error inserting user:', err.message);    
            throw err;    
           } else {    
            const userId = results.insertId;   
            const poc_id_query = `SELECT POC_Id FROM POC WHERE POC_Name = "${userState[from].doctor_name}" `;  
            connection.execute(poc_id_query, (err, pocresults) => {    
              if (err) {    
              console.error('Error fetching poc id:', err.message);    
              throw err;    
              } else {    
              const poc_id = pocresults[0].POC_Id; 
              const appointmentQuery = `INSERT INTO Appointments (Client_ID, User_ID, Appointment_Date,POC_ID, User_Location, User_Name, Appointment_Type) VALUES (?, ?, ?, ?, ?, ?, ?)`;    
              const appointmentParams = [1, userId, new Date(),poc_id,'', userState[from].name, userState[from].type];    
          
              connection.execute(appointmentQuery, appointmentParams, (err, results) => {    
                if (err) {    
                console.error('Error inserting appointment:', err.message);    
                throw err;    
                } else {    
                const appointmentId = results.insertId;    
                const reply = `We are waiting for your arrival. Your appointment ID is ${appointmentId}.`;    
                sendWhatsAppMessage(from, reply);    
                }    
              });    
              }  
            });  
           }    
          });    
        }
    } catch (error) {   
      console.error('Error inserting appointment and user:', error.message);   
      throw error;   
    }   
  }

  function fetchDepartments() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Value_name FROM List WHERE Key_name = "DEPARTMENT" ORDER BY Display_Order';
        const connection = getConnection();

        connection.execute(query, (err, results) => {
            if (err) {
                console.error('Error fetching departments:', err.message);
                reject(err);
            } else {
                // Map results to extract the value names
                const departments = results.map(row => row.Value_name);
                resolve(departments); 
            }
        });
    });
}

function fetchDoctors(dept_name) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT POC_Name FROM poc WHERE Client_ID = 1 AND Specialization = ?';
      const connection = getConnection();

      connection.execute(query,[dept_name],(err, results) => {
          if (err) {
              console.error('Error fetching departments:', err.message);
              reject(err);
          } else {
              // Map results to extract the value names
              const doctors = results.map(row => row.POC_Name);
              resolve(doctors); 
          }
      });
  });
}

// Function to get available dates for a doctor  
function getAvailableDates(doctor) {  
  return new Promise((resolve, reject) => {  
     const query = `SELECT DISTINCT Schedule_Date FROM poc_available_slots WHERE POC_ID = (SELECT POC_Id FROM POC WHERE POC_Name = ?) AND Schedule_Date >= CURDATE() AND appointments_per_slot > 0`;  
     const connection = getConnection();  
 
     connection.execute(query, [doctor], (err, results) => {  
       if (err) {  
          console.error('Error fetching available dates:', err.message);  
          reject(err);  
       } else {  
          // Extract available dates from the results and format them  
          const availableDates = results.map(row => moment(row.Schedule_Date).format('YYYY-MM-DD'));  
          resolve(availableDates); // Return available dates  
       }  
     });  
  });  
}  
 
function getAvailableTimes(doctor, appointment_date) {   
  return new Promise((resolve, reject) => {   
    const query = `SELECT Start_Time, End_Time FROM poc_available_slots WHERE POC_ID = (SELECT POC_Id FROM POC WHERE POC_Name = ?) AND Schedule_Date = ? AND appointments_per_slot > 0`;   
    const connection = getConnection();   
  
    connection.execute(query, [doctor, appointment_date], (err, results) => {   
     if (err) {   
       console.error('Error fetching available times:', err.message);   
       reject(err);   
     } else {   
       // Extract available times from the results and format them   
       const availableTimes = results.map(row => {   
         return `${row.Start_Time} - ${row.End_Time}`;   
       });   
       resolve(availableTimes); // Return available times   
     }   
    });   
  });   
}  
  module.exports={fetchMenuAction,fetchEmergencyReasons,getMenuNameFromParentMenuName,insertAppointmentAndUser, fetchDepartments, fetchDoctors, getAvailableDates, getAvailableTimes};