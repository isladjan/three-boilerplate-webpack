import "./css/style.css";       
import "./css/style2.css";      

import Main from './js/main.js';          
import { hi } from './js/pomocni_modul_1';    
import { hello } from './js/pomocni_modul_2';    



/*-----------------------------------------------------------------------------------*/
/*  01. INIT
/*-----------------------------------------------------------------------------------*/

const initApp = () => {
    hi();           
    hello();        

    const effect = new Main();
    effect.animate();
};
initApp();



