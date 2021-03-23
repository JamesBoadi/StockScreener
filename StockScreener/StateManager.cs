/* Manages the state of the application */
using System;
using System.Xml;

namespace StockScreener
{
    public class StateManager
    {



        /* Add request to XML file */
        public static void storeRequest(int request)
        {



        }

        static XmlTextReader textReader = new XmlTextReader("State.xml");

        /* Get request from XML file */
        public static void getTotalRequests(int request)
        {
            while (textReader.Read())
            {
                XmlNodeType node = textReader.NodeType;
                // If node type us a declaration  
                if (node == XmlNodeType.Attribute)
                {
                    Console.WriteLine("Declaration:" + textReader.Name.ToString());
                }

            }

        }


        /*public static void request(int request)
        {

        }*/



    }

}