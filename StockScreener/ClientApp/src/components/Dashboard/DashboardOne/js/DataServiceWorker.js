/* A service worker for handling connections and user requests */
export default function DataServiceWorker(newConnection) {

    /* Establish a connection here */
    window.onload = async function () {
        const res = await newConnection();
        // Ok
        if (res) {
            console.log(res)

        }
        else
        {
            // 404
        }
/*
        if ((localStorage.getItem('connection') === null ||
            localStorage.getItem('connection') === undefined)) {

            localStorage.setItem('connection', 'false')

            const res = await newConnection();

            if (res) {
                console.log('Initialise 1 ')
                localStorage.removeItem('connection');
                localStorage.setItem('connection', 'true');
            }
        }
        else {
            if (localStorage.getItem('connection') !== 'true') {
                const res = await newConnection();
                if (res) {
                    console.log('Initialise 2 ')
                    localStorage.removeItem('connection');
                    localStorage.setItem('connection', 'true');
                }
            }
        }*/
    }


    /* Establish if a user is connected 
       first, if not retry. This is 
       loaded at the very start of loading
       the app 
    function establishConnection(params) {
        // Ip address....
        return false; // Redirect to 404
    }
*/


}