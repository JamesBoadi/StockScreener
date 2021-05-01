/* Set Start Prices and Target Prices */
export default class AlertSettings {

    static startTime = "";
    static endTime = "";
    static auto = false;
    static manual = false;
    static updateAlertSettings = false;
    static alertInterval = 60000;
    static settingsTriggered = 0;
    static TimeStamp = "";

    static setTime(startTime, endTime)
    { 
        this.startTime = startTime;
        this.endTime = endTime;
    }

    static getStartTime()
    {
        return this.startTime;
    }

    static getEndTime()
    {
        return this.endTime;
    }

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

    static setManual(alert) {
        this.manual = alert;
    }

    static setAuto(alert) {
        this.auto = alert;
    }

    static getManual() {
        return this.manual;
    }

    static getAuto() {
        return this.auto;
    }

    static setAlertInterval(interval) {
        this.alertInterval = parseInt(interval);
    }

    static getAlertInterval() {
        return parseInt(this.alertInterval);
    }

    static getAlertSettings()
    {
        const h = parseInt((new Date().getHours() + 8) >= 17 ? 24 - new Date().getHours()
            : new Date().getHours() + 8);
        const m = new Date().getMinutes().toPrecision(2);
        this.TimeStamp = h + ':' + m;
  
        const json = {
            
            manual: this.manual,
            auto: this.auto, 
            updateAlertSettings: this.updateAlertSettings,
            alertInterval: this.alertInterval,
            startTime: this.startTime,
            endTime: this.endTime,
            settingsTriggered: this.settingsTriggered,
            timeStamp: this.TimeStamp
        }

        return JSON.stringify(json);
    }






}