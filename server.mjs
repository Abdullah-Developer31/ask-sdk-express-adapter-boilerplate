import express from "express";
import Alexa, { SkillBuilders } from 'ask-sdk-core';
import morgan from "morgan";
import { ExpressAdapter } from 'ask-sdk-express-adapter';

const app = express();
app.use(morgan("dev"))
const PORT = process.env.PORT || 3000;

const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
      const speakOutput = 'Hello and Welcome, I am the virtual version. What would you like to ask?.I can tell you the name and working experience.';

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};
const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'nameIntent';
  },
  handle(handlerInput) {
      const speakOutput = 'My name is Abdullah Majeed, people call me addy as well, would you like me to ask my working experience?';

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt('to know my work experience say, what is my working experience')
          .getResponse();
  }
};
const WorkExperienceIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'workExperience';
  },
  handle(handlerInput) {
      const speakOutput = `I started my software engineering career in 2019 as web
      and mobile application developer and now i am currently working on AI and Chatbot voice applications.`;

      return handlerInput.responseBuilder
          .speak(speakOutput)
          // .reprompt('to know my work experience say, what is my working experience')
          .getResponse();
  }
};
const WeatherUpdateIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'weatherIntent';
  },
async handle(handlerInput) {
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      // console.log("slots: ",slots);
      const cityName = slots.cityName;
      // console.log("cityName: ",cityName)
      const apiKey = '323dfcc99ccbcc29fe092c8adbb757bf';
      let citytemp=''
      await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&appid=${apiKey}&units=metric`)
       .then(function (response) {
          // handle success
          // console.log(response);
          var temp = response.data.main.temp;
          // console.log("data:" ,temp)
         citytemp = temp; 
          
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        
       const speakOutput = `weather of ${cityName.value} is ${citytemp} degree centigrade.`;

          return handlerInput.responseBuilder
              .speak(speakOutput)
              // .reprompt('to know my work experience say, what is my working experience')
              .getResponse();
     
  }
};
const BookRoomIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BookRoom';
  },
  handle(handlerInput) {
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      // console.log("slots: ",slots);
        const numberOfPeople = slots.numberOfPeople;
        const roomType = slots.roomType;
        const arrivalDate = slots.arrivalDate;
        const Duration = slots.Duration;
        console.log("numberOfPeople: ",numberOfPeople);
        console.log("roomType: ",roomType);
        console.log("arrivalDate: ",arrivalDate);
        console.log("Duration: ",Duration);
      
      const speakOutput = `Your room booking is completed.`;

      return handlerInput.responseBuilder
          .speak(speakOutput)
          // .reprompt('to know my work experience say, what is my working experience')
          .getResponse();
  }
};
const ErrorHandler = {
  canHandle() {
      return true;
  },
  handle(handlerInput, error) {
      const speakOutput = 'Sorry, This is a error handler intent. Please try again.';
      console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};



const skillBuilder = SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    WorkExperienceIntentHandler,
    WeatherUpdateIntentHandler,
    BookRoomIntentHandler
  )
  .addErrorHandlers(
    ErrorHandler
  )
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);

app.post('/api/v1/webhook-alexa', adapter.getRequestHandlers());

app.use(express.json())
app.get('/profile', (req, res, next) => {
  res.send("this is a profile");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});





