const express = require('express');
const dotenv = require('dotenv');
const logger = require('./logger');
const {sendWhatsAppMessage, sendInteractiveMessage, sendRadioButtonMessage, validateEmail} = require('./utils');
const { connectDB,getConnection } = require('./db');
const { fetchMenuAction,fetchMenuName, fetchEmergencyReasons,getClientName,getClientID, getMenuNameFromParentMenuName, insertAppointmentAndUser, fetchDepartments, fetchDoctors,getAvailableDates, getAvailableTimes} = require('./dbController');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
connectDB();

const userState = {};

async function getParentMenuIdByInput(input) {  
    return new Promise((resolve, reject) => {  
     const menuName = input;  
     const query = `SELECT Parent_Menu_ID FROM Menu WHERE Menu_Name = ?`;  
     const connection = getConnection();  
    
     connection.execute(query, [menuName], (err, results) => {  
      if (err) {  
        console.error('Error fetching emergency reasons:', err.message);  
        reject(err);  
      } else {  
        // Map results to extract the value names  
        const parentMenuID = results[0].Parent_Menu_ID;  
        console.log(parentMenuID);
        resolve(parentMenuID);  
      }  
     });  
    });  
  }
  
  async function getMenuIdFromInput(input) {  
    try {  
     const parentMenuId = await getParentMenuIdByInput(input);  
     console.log(`Parent Menu ID: ${parentMenuId}`);  
    
     if (parentMenuId === null) {  
      throw new Error(`No matching menu item found for identifier: ${input}`);  
     }  
    
     const menuItems = await fetchMenuAction(null, parentMenuId);  
     const inputAsNumber = parseInt(input, 10);  
    
     // Check if input matches a Menu_ID  
     if (!isNaN(inputAsNumber)) {  
      const menuItem = menuItems.find(item => item.Menu_ID === inputAsNumber);  
      return menuItem ? menuItem.Menu_ID : null;  
     }  
    
     // Check if input matches any Menu_Name  
     const menuItemByName = menuItems.find(item => item.Menu_Name.toLowerCase() === input.toLowerCase());  
     return menuItemByName ? menuItemByName.Menu_ID : null;  
    } catch (error) {  
     console.error('Error fetching menu ID:', error.message);  
     throw error;  
    }  
  }

// Define handleUserSelection function
async function handleUserSelection(from, messageBody) {
    const currentMenuId = await getMenuIdFromInput(messageBody);

    console.log(`User selection: ${messageBody}, resolved Menu_ID: ${currentMenuId}`);

    if (currentMenuId === null) {
        await sendWhatsAppMessage(from, 'Invalid selection. Please try again.');
        return;
    }

    const selectedMenu = await fetchMenuAction(currentMenuId);
    if (selectedMenu.length === 0) {
        await sendWhatsAppMessage(from, 'Invalid selection. Please try again.');
        return;
    }

    const nextAction = selectedMenu[0].Action;
    console.log(`Action selected: ${nextAction}`); // Debug log to check current action

    // Action-based handling
    if (nextAction === 'SHOW_APPOINTMENT_OPTIONS') {
        console.log(messageBody);
        const parentMenuID =  await getMenuIdFromInput(messageBody);
        const appointmentMenu = await fetchMenuName(parentMenuID);
        const appointmentOptions = appointmentMenu.map((appnt => ({
            id: appnt,
            title: appnt,
        })));
        if (appointmentMenu.length === 0) {
            await sendWhatsAppMessage(from, 'No apointment options found. Please try again.');
            return;
        }

        await sendRadioButtonMessage(from, 'Select an Appointment option:', appointmentOptions);

        userState[from].step = 1.1; // Move to next step
    } else if (nextAction === 'FETCH_EMERGENCY_REASONS') {
        const reasons = await fetchEmergencyReasons();
        const reasonOptions = reasons.map((reason => ({
            id: reason,
            title: reason
        })));
        if (reasons.length === 0) {
            await sendWhatsAppMessage(from, 'No emergency reasons found. Please try again.');
            return;
        }

        await sendRadioButtonMessage(from, 'Select an emergency reason:', reasonOptions);
        userState[from].step = 1.2; // Move to next step
    } else if (nextAction === 'ASK_LIVE_LOCATION') {
        await sendWhatsAppMessage(from, "Share you Location");
        userState[from].step = 1.3; // Move to next step                      
    } else if (nextAction === 'ASK_NAME_EMERGENCY') {
        await sendWhatsAppMessage(from, "Enter Your Name");
        userState[from].step = 1.4; // Move to next step
    } else if (nextAction === 'CONFIRM_EMERGENCY') {
        await sendWhatsAppMessage(from, "Please Confirm Your Details");
        reply=`Name: ${userState[from].name},
Location: ${userState[from].location},
Emergency Reason: ${userState[from].emergency_reason_name}`;
        await sendWhatsAppMessage(from, reply);
        await sendInteractiveMessage(from, 'Click Yes if the details are correct!', [
          { id: 'finalize_emergency', title: 'Yes' },
          { id: 'unfinalize_emergency', title: 'No' },
        ]);
        userState[from].step = 1.5; // Move to next step
    }  else if (nextAction === 'FETCH_DEPARTMENTS_DIRECT') {
        const departments = await fetchDepartments();
        const deptOptions = departments.map((department => ({
            id: department,
            title: department
        })));
        if (departments.length === 0) {
            await sendWhatsAppMessage(from, 'No Departments found. Please try again.');
            return;
        }

        await sendRadioButtonMessage(from, 'Select an department:', deptOptions);
        userState[from].step = 2;
    } else if (nextAction === 'FETCH_DOCTORS_DIRECT') {
        const doctors = await fetchDoctors(userState[from].department_name);
        const docOptions = doctors.map((doctor => ({
            id: doctor,
            title: doctor
        })));
        if (doctors.length === 0) {
            await sendWhatsAppMessage(from, 'No Doctors found. Please try again.');
            return;
       }
      await sendRadioButtonMessage(from, 'Select Doctor:', docOptions);
      userState[from].step = 2.1;
    }else if (nextAction === 'FETCH_AVAILABLE_DATES_DIRECT') {  
      const availableDates = await getAvailableDates(userState[from].doctor_name);  
      const dateOptions = availableDates.map(date => ({  
         id: date,  
         title: date  
      }));  
      await sendRadioButtonMessage(from, 'Select a date:', dateOptions);  
      userState[from].step = 2.2;  
   } else if (nextAction === 'FETCH_AVAILABLE_TIMES_DIRECT') {  
    const availableTimes = await getAvailableTimes(userState[from].doctor_name, userState[from].appointment_date);  
    const timeOptions = availableTimes.slice(0, 10).map(time => ({  
       id: time,  
       title: time  
    }));  
    await sendRadioButtonMessage(from, 'Select a time:', timeOptions);  
    userState[from].step = 2.3;  
    userState[from].availableTimes = availableTimes;  
    } else if (nextAction === 'ASK_NAME_DIRECT') {
        await sendWhatsAppMessage(from, "Enter Your Name");
        userState[from].step = 2.4; // Move to next step
    } else if (nextAction === 'ASK_EMAIL_DIRECT') {
        await sendWhatsAppMessage(from, "Enter Your Email ID");
        userState[from].step = 2.5;
    } else if (nextAction === 'ASK_PHONE_NUMBER_DIRECT') {
        await sendWhatsAppMessage(from, "Enter Your Phone Number");
        userState[from].step = 2.6;
    } else if (nextAction === 'CONFIRM_DIRECT_APPOINTMENT') {
        await sendWhatsAppMessage(from, "Please Confirm Your Details");
        reply=`Name: ${userState[from].name},
Email: ${userState[from].email},
Phone: ${userState[from].phone_number},
Department: ${userState[from].department_name},
 Doctor: ${userState[from].doctor_name},
Date: ${userState[from].appointment_date},
Time: ${userState[from].appointment_time}`;
        await sendWhatsAppMessage(from, reply);
        await sendInteractiveMessage(from, 'Click Yes if the details are correct!', [
          { id: 'finalize_direct', title: 'Yes' },
          { id: 'unfinalize_direct', title: 'No' },
        ]);
        userState[from].step = 2.7; // Move to next step
    } else if (nextAction === 'FETCH_RESCHEDULE_OPTIONS') {
        await sendWhatsAppMessage(from, "You have selected Reschedule Appointment.");
    } else if (nextAction === 'FETCH_CANCEL_OPTIONS') {
        await sendWhatsAppMessage(from, "You have selected Cancel Appointment.");
    } else {
        await sendWhatsAppMessage(from, 'Action not recognized. Please try again.');
    }
}

// Start of the server and webhook handler
app.get('/', (req, res) => {
    res.send(' Welcome to the Miot Hospital.How can I help you today?');
});

// Webhook verification
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'your_verify_token';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Webhook event handler
app.post('/webhook', async (req, res) => {
    const body = req.body;
    //console.log(JSON.stringify(body));
    const displayPhoneNumber = body.entry[0].changes[0].value.metadata.display_phone_number;  
const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;  
process.env.PHONE_NUMBER_ID = phoneNumberId;
  
console.log(`Display Phone Number: ${displayPhoneNumber}`);  
console.log(`Phone Number ID: ${phoneNumberId}`);


    if (body.object) {
        const changes = body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages;

        if (changes && changes[0]) {
            const from = changes[0].from;
            const messageBody = changes[0].text
                ? changes[0].text.body
                : changes[0].interactive && changes[0].interactive.button_reply
                    ? changes[0].interactive.button_reply.id
                    : changes[0].interactive && changes[0].interactive.list_reply
                        ? changes[0].interactive.list_reply.id
                        : null;

            console.log(`Received message: ${messageBody} from: ${from}`);
            if (messageBody && messageBody.toLowerCase() === 'hi') {
                userState[from] = { step: 0, currentPage: 1 }; // Reset user state to start fresh
                userState[from].Client_ID=await getClientID(displayPhoneNumber);
            }

            switch (userState[from].step) {
                case 0:
                    userState[from].Client_Name = await getClientName(userState[from].Client_ID);
                    console.log(userState[from].Client_Name);
                    await sendWhatsAppMessage(from, `Welcome to ${userState[from].Client_Name}😊. How can I help you today?`);
                    const mainMenu = await fetchMenuAction(null, 0);
                    const options = mainMenu.map(menuItem => ({
                        id: menuItem.Menu_Name,
                        title: menuItem.Menu_Name
                    }));
                    await sendInteractiveMessage(from, 'Select Your preference below', options);
                    userState[from].step = 1;
                    break;

                case 1:
                    await handleUserSelection(from, messageBody);
                    break;

                case 1.1:
                    userState[from].type=messageBody;
                    await handleUserSelection(from,userState[from].type);
                    break;
                    
                case 1.2:
                    userState[from].emergency_reason_name=messageBody;
                    userState[from].parentMenuName= await getMenuNameFromParentMenuName(userState[from].type);
                    console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                    await handleUserSelection(from,userState[from].parentMenuName);
                    break;

                case 1.3:
                    userState[from].location=messageBody; // Store user's location
                    userState[from].parentMenuName= await getMenuNameFromParentMenuName(userState[from].parentMenuName);
                    console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                    await handleUserSelection(from,userState[from].parentMenuName);
                    break;
                case 1.4:
                    userState[from].name=messageBody; // Store user's name
                    userState[from].parentMenuName= await getMenuNameFromParentMenuName(userState[from].parentMenuName);
                    console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                    await handleUserSelection(from,userState[from].parentMenuName);
                    break;
                case 1.5:
                    
                    if(messageBody=='finalize_emergency')
                        {   
                            await insertAppointmentAndUser(from, userState); 
                            await sendInteractiveMessage(from, 'What would you like to do next?', [
                                { id: 'main_menu', title: 'Main Menu' },
                                { id: 'close_chat', title: 'Close Chat' }
                            ]);
                            userState[from].step = 4;
                            break;
                        }
                        else if(messageBody=='unfinalize_emergency')
                        {
                            reply='Edit you details again';
                            await sendWhatsAppMessage(from, reply);
                            userState[from].step=0;
                            break;
                        }
                        else{
                            reply = 'Invalid choice🚫. Please select a valid option.';
                            await sendWhatsAppMessage(from, reply);
                            break;
                        }

                case 2:
                    userState[from].department_name = messageBody;
                    userState[from].parentMenuName = await getMenuNameFromParentMenuName(userState[from].type);
                    console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                    await handleUserSelection(from,userState[from].parentMenuName);
                    break;

                case 2.1:
                    userState[from].doctor_name = messageBody;
                    userState[from].parentMenuName = await getMenuNameFromParentMenuName(userState[from].parentMenuName);
                    console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                    await handleUserSelection(from, userState[from].parentMenuName);
                    break;
                
                case 2.2:
                    userState[from].appointment_date=messageBody;
                    userState[from].parentMenuName = await getMenuNameFromParentMenuName(userState[from].parentMenuName);
                    console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                    await handleUserSelection(from, userState[from].parentMenuName);
                    break;
              
                case 2.3:
                      
                        // Handle the selected time  
                        userState[from].appointment_time=messageBody;
                        userState[from].parentMenuName = await getMenuNameFromParentMenuName(userState[from].parentMenuName);
                        console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                        await handleUserSelection(from, userState[from].parentMenuName);
                     
                     break;

                case 2.4:
                    userState[from].name=messageBody; // Store user's name
                    userState[from].parentMenuName= await getMenuNameFromParentMenuName(userState[from].parentMenuName);
                    console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                    await handleUserSelection(from,userState[from].parentMenuName);
                    break;

                case 2.5:
                    if (validateEmail(messageBody)) {
                        userState[from].email = messageBody;
                        userState[from].parentMenuName= await getMenuNameFromParentMenuName(userState[from].parentMenuName);
                        console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                        await handleUserSelection(from,userState[from].parentMenuName);
                    }
                    else {
                        reply = 'Invalid email address. Please enter a valid email address.';
                        await sendWhatsAppMessage(from, reply);
                    }
                    break;

                case 2.6:
                    userState[from].phone_number=messageBody; // Store user's phone no
                    userState[from].parentMenuName = await getMenuNameFromParentMenuName(userState[from].parentMenuName);
                    console.log(`Parent Menu Names: ${JSON.stringify(userState[from].parentMenuName)}`); // Log for debugging
                    await handleUserSelection(from, userState[from].parentMenuName);
                    break;

                case 2.7:
                    if(messageBody=='finalize_direct')
                        {   
                            await insertAppointmentAndUser(from, userState); 
                            await sendWhatsAppMessage(from, 'Thank you for your appointment!');
                            await sendInteractiveMessage(from, 'What would you like to do next?', [
                                { id: 'main_menu', title: 'Main Menu' },
                                { id: 'close_chat', title: 'Close Chat' }
                                ]);
                            userState[from].step = 4;
                            break;
                        }
                        else if(messageBody=='unfinalize_direct')
                        {
                            reply='Edit you details again';
                            await sendWhatsAppMessage(from, reply);
                            userState[from].step=0;
                            break;
                        }
                        else{
                            reply = 'Invalid choice🚫. Please select a valid option.';
                            await sendWhatsAppMessage(from, reply);
                            break;
                        }
                    
                // Additional case handling
                case 4: // Main menu or close chat options
                    if (messageBody === 'main_menu') {
                        reply = 'Please type "Hi" to continue again!';
                        await sendWhatsAppMessage(from, reply);
                        userState[from] = { step: 0 }; // Reset state
                    } else if (messageBody === 'close_chat') {
                        reply = 'Thank you for using our service. Goodbye!';
                        await sendWhatsAppMessage(from, reply);
                        userState[from] = {}; // Clear state
                    } else {
                        reply = 'Please select "Main Menu" or "Close Chat".';
                        await sendWhatsAppMessage(from, reply);
                    }
                    break;   
                     
                default:
                    await sendWhatsAppMessage(from, 'Please type "Hi" to start the conversation.');
                    break;
            }

            res.sendStatus(200);
        } else {
            res.sendStatus(200);
        }
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
