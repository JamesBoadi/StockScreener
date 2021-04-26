export default class TableSettings {

    static settings = false;

    static getSettings(settings)
    {
        this.settings = settings; 
    }

    static setSettings()
    {
        return this.settings;
    }
}