const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

// Function to validate email format
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    return re.test(String(email).toLowerCase());
};

// Function to send a plain text WhatsApp message
async function sendWhatsAppMessage(to, message) {
    const url = `https://graph.facebook.com/v13.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const headers = {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,  // Use the correct token
        'Content-Type': 'application/json'
    };
    const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
    };
    
    try {
        await axios.post(url, data, { headers });
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
}

// Function to send a button message (interactive message)
async function sendInteractiveMessage(to, bodyText, buttons) {
    // Ensure there's at least one button
    if (buttons.length === 0) {
        console.error('No buttons provided for interactive message.');
        return; // Exit if no buttons are provided
    }

    // Limit the number of buttons to 3
    const limitedButtons = buttons.slice(0, 3);

    const url = `https://graph.facebook.com/v13.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const headers = {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,  // Use the correct token
        'Content-Type': 'application/json'
    };
    const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
            type: 'button',
            body: {
                text: bodyText
            },
            action: {
                buttons: limitedButtons.map((button) => ({
                    type: 'reply',
                    reply: {
                        id: button.id,
                        title: button.title
                    }
                }))
            }
        }
    };

    try {
        await axios.post(url, data, { headers });
        console.log('Interactive message sent successfully');
    } catch (error) {
        console.error('Error sending interactive message:', error.response ? error.response.data : error.message);
    }
}


// Function to send a radio button message (list message)
async function sendRadioButtonMessage(to, headerText, options) {
    const url = `https://graph.facebook.com/v13.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const headers = {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,  // Use the correct token
        'Content-Type': 'application/json'
    };
    const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
            type: 'list',
            header: {
                type: 'text',
                text: headerText
            },
            body: {
                text: "👇🏻"
            },
            action: {
                button: 'Select',
                sections: [
                    {
                        title: 'Options',
                        rows: options.map((option) => ({
                            id: option.id, // Option IDs should be unique and consistent
                            title: option.title
                        }))
                    }
                ]
            }
        }
    };

    try {
        await axios.post(url, data, { headers });
        console.log('Radio button message sent successfully');
    } catch (error) {
        console.error('Error sending radio button message:', error.response ? error.response.data : error.message);
    }
}

// Function to send a dropdown message  
async function sendDropdownMessage(from, message, options) {  
    const payload = {  
       messaging_product: 'whatsapp',  
       to: from,  
       type: 'interactive',  
       interactive: {  
         type: 'list',  
         header: {  
            type: 'text',  
            text: message  
         },  
         body: {  
            text: 'Please select a time from the list'  
         },  
         footer: {  
            text: 'Select a time:'  
         },  
         action: {  
            button: 'Select',  
            sections: [  
               {  
                 title: 'Available Times',  
                 rows: options.map(option => ({  
                    id: option.id,  
                    title: option.title  
                 }))  
               }  
            ]  
         }  
       }  
    };  
    await sendWhatsAppMessage(from, payload);  
 }
 

// Exporting functions
module.exports = {
    validateEmail,
    sendWhatsAppMessage,
    sendInteractiveMessage,
    sendRadioButtonMessage,
    sendDropdownMessage
};
