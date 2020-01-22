window.onload = function () {

  d3.queue()
    .defer(d3.json, "custom.json")
    .defer(d3.csv, "full_db_vehicles.csv")
    .awaitAll(callFunctions);

  // after all data is loaded give each function the correct response
  function callFunctions(error, response) {
      if (error) throw error;

      createMap(error, response[0], response[1])
      slider()

      // // if bullet fish data is clicked load fishMap.js
      // $("#start").click(function() { play() })
      //
      // function play() {
      //   var checkBox1 = document.getElementsByName("attack1")
      //   var checkBox2 = document.getElementsByName("attack2")
      //   if(checkBox1.checked && checkBox2.checked == true){
      //     console.log("hoi")
      //     createMap(error, response[0], response[1])
      //     slider()
      //   }
      //   else if(checkBox1.checked == true){
      //     slider()
      //   }
      //   else if(checkBox2.checked == true){
      //     createMap(error, response[0], response[1])
      //   }
      // }
  }
};
