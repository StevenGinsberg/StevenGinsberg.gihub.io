$(document).ready(function () {

    loadItems();
    purchase();

});

function loadItems() {
    clearTable();
    var contentRows = $('#contentRows');
    clearTable();
    // $('changeReturn').hide();
    $.ajax({
        type: 'GET',
        url: 'https://vending.us-east-1.elasticbeanstalk.com',
        success: function (itemArray) {

            let group = 0;
            $.each(itemArray, function (index, item) {

                var itemId = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;

                var row;
                group++;
                //   if (group==4 ){
                //     row = '<tr>';
                // row += '<td>';
                // row +='</td>';
                // row += '</div>';
                // row += '<th>';
                // row += '</tr>';
                // row += '</th>';

                //   }
                // <div class="grid" style="--bs-columns: 3;">;
                // row = '<tr>';
                if (group == 4 || group == 7 || group == 10) {
                    row = '<tr>';
                    // row = '</tr>';
                    contentRows.append(row);
                }
                row = '<td class ="border m-5 p-1"  onclick="showItem(' + itemId + ')">' + itemId +
                    '<p style="text-align:center">' + name + '</p>' +
                    '<p style="text-align:center">' + '$' + + price + '</p>' +
                    // '<p style="display:none;">' +    +'</p>' +
                    '<p style="text-align:center">Quantity left: ' + quantity + '</p>'
                '</td>';

                //    if (group==4) {
                //     row += '</div>';
                //    }
                // {/* </div>; */}


                //  row += '</th>'; 

                // if (group==4 ){
                //     row = '<tr>';


                //   }


                contentRows.append(row);
            })

        },
        error: function () {

            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));

        }
    })


}
function showItem(itemId) {

    $('#errorMessages').empty();
    $('#itemNumber').val(itemId);

}

function addMoney(num) {

    $('#totalMoney').val((Number($('#totalMoney').val()) + Number(num)).toFixed(2));
    $('#errorMessages').empty();
    // $('#totalMoney')=$('#totalMoney')+money.val(num);

    //  var money=num;
    //  var money2=document.getElementById('#totalMoney').value;

    //  var sum= money+money2;


    // $('#totalMoney').val(num);

}

function purchase() {
    $('#makePurchase').click(function (event) {
        $.ajax({
            type: 'POST',
            url: 'http://vending.us-east-1.elasticbeanstalk.com/money/' + $('#totalMoney').val() + '/item/' + $('#itemNumber').val(),
            data: JSON.stringify({
                amount: $('#totalMoney').val(),
                id: $('#itemNumber').val()
            }),


            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',

            success: function (data, status) {
                $('#changeReturn').show();
                // var change = + data.quarters + ' Quarter(s) ' + data.dimes + ' Dime(s) ' + data.nickels + ' Nickel(s) ' + data.pennies + ' Pennies';
                var change = "";
                var quarters = + data.quarters + ' Quarter(s) ';
                var dimes = + data.dimes + ' Dime(s) ';
                var nickels = + data.nickels + ' Nickel(s) ';
                var pennies = + data.pennies + ' Pennies';

                if (!data.quarters == 0)
                    change += quarters;
                if (!data.dimes == 0)
                    change += dimes;
                if (!data.nickels == 0)
                    change += nickels;
                if (!data.pennies == 0)
                    change += pennies;


                $('#errorMessages').empty();
                $('#messageVM').val('Thank you');
                // //var display = response.responseJSON.message;
                $('#change').val(change);
            },


            error: function (response) {
                var displayMessage = response.responseJSON.message;
                $('#messageVM').val(displayMessage);
            }
            //    error: function () {
            //        $('#errorMessages')
            //         .append($('<li>')
            //         .attr({class: 'list-group-item list-group-item-danger'})
            //         .text(data.property)); 
            //         // console.log(data.property);
            //    }
        })
    });
}
//Pressing the change return button will clear the inputs, update the item list, and prepare for the next purchase.
function clearInputs() {

    $('#totalMoney').val('');
    $('#messageVM').val('');
    $('#itemNumber').val('');
    $('#change').val('');
    clearTable();
    loadItems();
    $('#changeReturn').hide();
}
function clearTable() {
    $('#contentRows').empty();

}
