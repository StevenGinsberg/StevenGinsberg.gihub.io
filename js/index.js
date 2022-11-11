$(document).ready(function () {
  loadItems();
  addMoney();
  purchaseItem();
});

function loadItems(){
  $.ajax({
      type: 'GET',
      url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
      success: function(itemArray) {
        var itemsDiv = $('#allItems');
        var count = 1;
        $.each(itemArray, function(index, item) {
            var itemInfo = '<div class="boxed'+count+'" onClick="selectItem('+item.id+')"><p ALIGN=Left>';
            itemInfo += item.id +'</p><p ALIGN = Center>';
            itemInfo += item.name + '<br><br>';
            itemInfo += '$' + item.price + '<br><br>';
            itemInfo += 'Quantity Left: ' + item.quantity + '<br>';
            itemInfo += '</p></div>';

            itemsDiv.append(itemInfo);
            count++;
        })
      },
      error: function() {
          alert('FAILURE!');
      }
  })
}

function addMoney(){
    $('#addDollar').on('click', function() {
      $('#messages').val('');
      $('#change').val('');
      $('#totalMoneyIn').val(((parseFloat($('#totalMoneyIn').val()))+1.00).toFixed(2));
    });

    $('#addQuarter').on('click', function() {
      $('#messages').val('');
      $('#change').val('');
      $('#totalMoneyIn').val(((parseFloat($('#totalMoneyIn').val()))+0.25).toFixed(2));
    });

    $('#addDime').on('click', function() {
      $('#messages').val('');
      $('#change').val('');
      $('#totalMoneyIn').val(((parseFloat($('#totalMoneyIn').val()))+0.10).toFixed(2));
    });

    $('#addNickel').on('click', function() {
      $('#messages').val('');
      $('#change').val('');
      $('#totalMoneyIn').val(((parseFloat($('#totalMoneyIn').val()))+0.05).toFixed(2));
    });
}

function selectItem(id){
  $('#item').val(id);
  $('#messages').val('');
  $('#change').val('');
}

function purchaseItem(){
    $('#makePurchase').on('click', function() {
      if ($('#item').val() == ''){$('#messages').val('Please make a selection.');}else{ //if no item selected

      $.ajax({ //if item selected
          type: 'POST',
          url: 'http://vending.us-east-1.elasticbeanstalk.com/money/'+$('#totalMoneyIn').val()+'/item/'+$('#item').val()+'',
          success: function(change) {
           // clearItems();
            //loadItems(); //refresh item stock
            $('#item').val(''); //refresh item selection
            $('#totalMoneyIn').val(0.00.toFixed(2)); //refresh money in
            $('#messages').val('Thank You!!');

            var quarters = change.quarters;
            var dimes = change.dimes;
            var nickels = change.nickels;
            var pennies = change.pennies;

            var changeMessage = '';

            if (quarters == 1){
              changeMessage+= '1 quarter';
            }
            else if (quarters>1){
              changeMessage+= quarters+' quarters';
            }

            if (dimes == 1){
              if (quarters>=1) {changeMessage+=', ';}
              changeMessage+= '1 dime';
            }
            else if (dimes>1){
              if (quarters>=1) {changeMessage+=', ';}
              changeMessage+=dimes+' dimes';
            }

            if (nickels == 1){
              if (quarters>=1 || dimes>=1) {changeMessage+=', ';}
              changeMessage+= '1 nickel';
            }
            else if (nickels>1){
              if (quarters>=1 || dimes>=1) {changeMessage+=', ';}
              changeMessage+= nickels+' nickels';
            }

            if (pennies == 1){
              if (quarters>=1 || dimes>=1 || nickels>=1) {changeMessage+=', ';}
              changeMessage+= '1 penny';
            }
            else if (pennies>1){
              if (quarters>=1 || dimes>=1 || nickels>=1) {changeMessage+=', ';}
              changeMessage+=pennies+' pennies';
            }

            $('#change').val(changeMessage); //display change returned

          },
          error: function(error) { //if insufficient funds or sold out
              $('#messages').val(error.responseText.slice(12,-2));
              //clearItems();
             // loadItems(); //refresh item stock
          }
        })
      }
    });
}

function clearItems(){
  $('#allItems').remove();

 var itemsDiv = $('.grid-container');
  itemsDiv.append('<div id="allItems"></div>');
}

function returnChange(){
  var money = $('#totalMoneyIn').val();
  if (money==0){
    $('#change').val('');
  }
  else{
    var numQuarters = Math.floor(money/0.25);
    money = (money % 0.25).toFixed(2);
    var numDimes = Math.floor(money/0.1);
    money = (money % 0.1).toFixed(2);
    var numNickels = Math.floor(money/0.05);
    money = (money % 0.05).toFixed(2);
    var numPennies = money;

    var changeMessage = '';

    if (numQuarters == 1){
      changeMessage+= '1 quarter';
    }
    else if (numQuarters>1){
      changeMessage+= numQuarters+' quarters';
    }

    if (numDimes == 1){
      if (numQuarters>=1) {changeMessage+=', ';}
      changeMessage+= '1 dime';
    }
    else if (numDimes>1){
      if (numQuarters>=1) {changeMessage+=', ';}
      changeMessage+= numDimes+' dimes';
    }

    if (numNickels == 1){
      if (numQuarters>=1 || numDimes>=1) {changeMessage+=', ';}
      changeMessage+= '1 nickel';
    }
    else if (numNickels>1){
      if (numQuarters>=1 || numDimes>=1) {changeMessage+=', ';}
      changeMessage+= numNickels+' nickels';
    }

    if (numPennies == 1){
      if (numQuarters>=1 || numDimes>=1 || numNickels>=1) {changeMessage+=', ';}
      changeMessage+= '1 penny';
    }
    else if (numPennies>1){
      if (numQuarters>=1 || numDimes>=1 || numNickels>=1) {changeMessage+=', ';}
      changeMessage+=numPennies+' pennies';
    }

    $('#change').val(changeMessage); //display change returned
    $('#totalMoneyIn').val(0.00.toFixed(2));

  }
  $('#messages').val('');
  $('#item').val('');
  clearItems();
  loadItems(); //refresh item list
}
