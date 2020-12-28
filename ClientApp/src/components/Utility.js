// A utility from converting to bytes

/*let cant =  Convert.ToBase64String(result.value);
  console.log(cant);

 
  static convertToytes(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
          break;
      }

      return out;
    }
  }
  static utf8_to_str(a) {

    for (var i = 0, s = ''; i < a.length; i++) {
      var h = a[i].toString(16)
      if (h.length < 2) h = '0' + h
      s += '%' + h
    }
    return decodeURIComponent(s)

  }

 /* let res;
      let ros;
      const response = await fetch('/test');
      // Process Stream
      const reader = response.body.getReader();
      //   console.log(decodeURIComponent(response.text()));
      let result;
      while (!(result = await reader.read()).done) {
        console.log(FetchData.utf8_to_str(result.value));
        console.log(String.fromCharCode(result.value));
  
  
        let arr_ = result.value;
        for (var i = 0; i < arr_.length; i++) {
          // res += String.fromCharCode.apply(String, array);
          res += String.fromCharCode(String, arr_[i]);
  
        }
  
        console.log(res);
  
        
            let arr_ = new Uint8Array(result.value);
            for (var i = 0; i < arr_.length; i++) 
            {
              ros += String.fromCharCode.apply(null, arr_[i]);
            
            }
        
            console.log( ros);
        
            console.log('chunk size:',result.value.toString());
            let arr_ = new Uint8Array(result.value);
            
            let ros = decodeURIComponent(arr_);
            console.log(ros);*/

        
/*   for (var i = 0; i < arr_.length; i++) 
  {   
   // res += String.fromCharCode.apply(String, array);
   // res += String.fromCharCode(result.value);
  
  }*/

  // res += String.fromCharCode.apply(String, arr_);

  //  res += String.fromCharCode(result.value);

  // console.log(res);

  /*
      let arr = String.fromCharCode.apply(null, new Uint8Array(res .toString()));
      console.log(arr + " " + arr[0]);
     /* // let arr_ = String.fromCharCode.apply(null, new Uint8Array(result.value.buffer));
      console.log("Ok " + parseInt(res) + " " + res);
      /* const stream = new ReadableStream({
  
         start(controller) {
           // The following function handles each data chunk
           function push() {
             // "done" is a Boolean and value a "Uint8Array"
             reader.read().then(({ done, value }) => {
               // Is there no more data to read?
               if (done) {
                 // Tell the browser that we have finished sending data
                 controller.close();
                 return;
               }
  
               // Get the data and send it to the browser via the controller
               controller.enqueue(value);
               push();
             });
           };
           push();
         }*
       });
       return new Response(stream, { headers: { "Content-Type": "text/html" } });*/
  // });



  //const data = (await response.blob()).text();
  //const view = new Float64Array(data[0])    Float64Array

  // let arr = String.fromCharCode.apply(null, new Uint8Array(data));
  //console.log("Ok " + parseInt(arr));

  // FetchData.convertFrombytes(data);
  //console.log("the data is " + data.text);
  //   this.setState({ forecasts: data, loading: false });