import { execFile } from "child_process";

const MEETING_PROCESSES = [
  "zoom.exe",
  "teams.exe",
  "webex.exe",
  "slack.exe"
];

let polling: NodeJS.Timeout | null = null;
let inMeeting = false;

function check() {
  execFile("tasklist", ["/FO", "CSV", "/NH"], (err, stdout) => {
    if (err) {
      inMeeting = false;
      return;
    }
    const lower = stdout.toLowerCase();
    inMeeting = MEETING_PROCESSES.some(p => lower.includes(p));
  });
}

export function startPolling() {
  if (polling) return;
  check();
  polling = setInterval(check, 5000);
}

export function stopPolling() {
  if (polling) {
    clearInterval(polling);
    polling = null;
  }
  inMeeting = false;
}

export function isInMeeting(): boolean {
  return inMeeting;
}
