/* Set Start Prices and Target Prices */
export default class PriceSettings {

    static startTime = "";
    static endTime = "";
    static triggerAlert = 0;
    static auto = true;
    static manual = false;
    static notifications = false;
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

    static getSettings()
    {
        const h = parseInt((new Date().getHours() + 8) >= 17 ? 24 - new Date().getHours()
            : new Date().getHours() + 8);
        const m = new Date().getMinutes().toPrecision(2);
        this.TimeStamp = h + ' : ' + m;
  
        const json = {
            triggerAlert: this.triggerAlert,
            manual: this.manual,
            auto: this.auto, 
            notifications: this.notifications,
            updateAlertSettings: this.updateAlertSettings,
            alertInterval: this.alertInterval,
            startTime: this.startTime,
            endTime: this.endTime,
            settingsTriggered: this.settingsTriggered,
            timestamp: this.TimeStamp
        }

        return JSON.stringify(json);
    }






}