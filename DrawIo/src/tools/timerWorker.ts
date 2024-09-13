let timer = 100;
let inactiveTimer = 30;

let interval;

onmessage = (e) => {
  const { startTimer } = e.data;

  console.log("in worker");

  if (startTimer) {
    interval = setInterval(() => {
      postMessage(--timer);
    }, 250);
  }
};
