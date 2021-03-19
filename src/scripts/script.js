'use strict';

const socket = new WebSocket("wss://fep-app.herokuapp.com");
const chat = document.querySelector('#chat');
const formInputs = document.querySelectorAll('.form-input');
const messageTemplate = document.querySelector('#message-Template').innerHTML;
const messageForm = document.querySelector('#message');

document.querySelector('#form').addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const message = getFormData();
  socket.send(JSON.stringify(message));
  clearMessageForm()
  return false;
}

socket.onopen = function(event) {
  alert('WebSocket is connected.');
};

socket.onmessage = function(event) {
  let message = JSON.parse(event.data);
  addMessage(message);
}


function getFormData() {
  const message = {};
  formInputs.forEach((input) => {
    message[input.name] = input.value;
    }
  );
  return message;
}

function addMessage(data) {
  const messageHtml = getMessageHtml(data);
  chat.insertAdjacentHTML('beforeend', messageHtml);
}

function getMessageHtml(data) {
  return messageTemplate
    .replace('{{username}}',data.username)
    .replace('{{message}}',data.message);
}

function clearMessageForm() {
  messageForm.value ='';;
}