/* Set Start Prices and Target Prices */
export default class PriceSettings {
    static startTime = [];
    static endTime = [];
    static dateTime = new Date();
    static dateTime = [];
    static triggerAlert = 0;
    static auto = true;
    static manual = false;
    static notifications = false;
    static updateAlertSettings = false;
    static alertInterval = 60000;
    static settingsTriggered = 0;
    static TimeStamp;

    // Enable local storage of states / Database 


    static triggerSettings()
    {
        return this.settingsTriggered;
    }

    static setTriggerSettings(value)
    {
        this.settingsTriggered = value;
    }

    static setUpdateAlertSettings(setter) {
        this.updateAlertSettings = setter;
    }

    static getUpdateAlertSettings() {
        return this.updateAlertSettings;
    }

    static setStartTime(hours, minutes) {
        this.startTime[0] = hours;
        this.startTime[1] = minutes;
    }

    static getStartTime() {
        return this.startTime;
    }

    static setEndTime(hours, minutes) {
        this.endTime[0] = hours;
        this.endTime[1] = minutes;
    }

    static getEndTime() {
        return this.endTime;
    }

    static setDateTime(hours, minutes) {
        this.dateTime[0] = hours;
        this.dateTime[1] = minutes;
    }

    static getDateTime() {
        return this.startTime;
    }

    static setManual(alert) {
        this.manual = new Boolean(alert);
    }

    static setAuto(alert) {
        this.auto = new Boolean(alert);
    }

    static getManual() {
        return this.manual;
    }

    static getAuto() {
        return this.auto;
    }

    static setTriggerAlert(alert) {
        this.triggerAlert = alert;
    }

    static getTriggerAlert() {
        return this.triggerAlert;
    }

    static setAlertInterval(interval) {
        this.alertInterval = parseInt(interval);
    }

    static getAlertInterval() {
        return parseInt(this.alertInterval);
    }






    static triggerAlert() {
        let startTime_hours = this.startTime[0];
        let startTime_minutes = this.tartTime[1];

        let endTime_hours = this.endTime[0];
        let endTime_minutes = this.endTime[1];

        // Hard Coded
        let dateTime_hours = (this.dateTime.getUTCHours() + 8 >= 24) ? Math.abs(24 - (this.dateTime.getUTCHours() + 8))
            : this.dateTime.getUTCHours() + 8;
        let datetime_minutes = this.dateTime.getMinutes();

        // Trigger an alert if it is within time frame
        if (dateTime_hours >= 9 && dateTime_hours <= 5) {
            if (startTime_hours >= dateTime_hours && endTime_hours < dateTime_hours) {

                if (dateTime_hours == 4 && endTime_minutes <= 59) {
                    //alertBool = true;
                }


            }
        }
    }



}