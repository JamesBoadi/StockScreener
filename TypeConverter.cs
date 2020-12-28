using System;
using EODHistoricalData.NET;
using System.Web;
using System.Collections.Generic;

namespace StockScreener 
{
    public class TypeConverter : DataInterface
    {
        Type[] types = new Type[]{ typeof(long), typeof(int) };
        // Return the type for each info in stock
        public Type detectType(Type data)
        {   
            Type getType = data.GetType(); 

            bool result = (types[0] == getType);

            return getType;
        }

 
        public byte[] convertToBytes(String data)
        {
            String enc = HttpUtility.UrlEncode(data);
            char[] arr = enc.ToCharArray();
            
            Stack<byte> characters = new Stack<byte>();

             for(int i=0; i < enc.Length;) 
             {
                if(arr[i] == '%') {
                    characters.Push((byte) Int16.Parse(enc.Substring(i+1, 2)));
                    i += 3;
                
                } else {
                    characters.Push((byte)(enc[i++]));
                }
            }
        
            return characters.ToArray();
        }


      /*  public byte convertToBytes(object data)
        {
            Type result = detectType(data);

            foreach(Type valueType in types)
            {
                result = (valueType == getType) ? valueType : null;
            }

            byte b = new byte[8];
            byte convertedObject = (byte) Convert.ChangeType(data, byte);
        }*/
    }
}