$(document).ready(function () {
    $('#summernote').summernote()
    // Calculate values on change of service
    $('.service-selector').on('change', function () {
        var row = $(this).closest('.item-row');
        var selectedOption = $(this).find(':selected');
        var charge = selectedOption.data('charge');

        // Set charge and recalculate subtotal
        row.find('.charge').val(charge);
        row.find('.service-description').text(selectedOption?.data('description'));
        recalculateSubtotal(row);
        $("#gross_amount").val(charge)
        $("#discount_amount").val(parseFloat(row.find('.discount').val()) || 0)
    });
    // Recalculate on input change
    $('.item-row input').on('input', function () {
        var row = $(this).closest('.item-row');
        recalculateSubtotal(row);
    });

    function recalculateSubtotal(row) {
        var quantity = parseFloat(row.find('.quantity').val()) || 0;
        var charge = parseFloat(row.find('.charge').val()) || 0;
        var discount = parseFloat(row.find('.discount').val()) || 0;
        var tax = parseFloat(row.find('.tax').val()) || 0;

        var subtotal = (quantity * charge) - discount + tax;
        row.find('.subtotal').val(subtotal);
    }
});

function getAttributes(serviceId) {
    var isChanged = $("#previous_service_id").val() != serviceId ? 1 : 0;
    $("#is_changed").val(isChanged)
    $.ajax({
      type: "GET",
      url: '{{route("get-attributes")}}',
      data: {
          "_token": "{{ csrf_token() }}",
          "service_id": serviceId,
      },
      success:function(result){
          $('#attributesTable tbody').empty();
            $.each(result, function (index, mapping) {
                appendAttributeRow(mapping);
            });
      }
  });
}
function appendAttributeRow(mapping) {
    var type = mapping.attribute.type;
    var name = mapping.attribute.name;
    var id = mapping.attribute.id;
    var optionCount = mapping.attribute.options.length;
    var options = mapping.attribute.options;
    if(type == 'text' || type == 'date'|| type == 'number') {
    var row = '<tr><td>' + name + '</td>'+
    '<td><input type="'+type+'" name="attributes['+id+']" class="form-control" placeholder="'+name+'"></td></tr>';
    } else if (type == 'textarea') {
    var row = '<tr><td>' + name + '</td>'+
    '<td><textarea name="attributes['+id+']" class="form-control" placeholder="'+name+'"></textarea></td></tr>';
    } else if (type == 'dropdown') {
    var options = '';
    $.each(mapping.attribute.options, function (index, option) {
        options += '<option value="' + option.id + '">' + option.option + '</option>';
    });
    var row = '<tr><td>' + name + '</td>' +
        '<td><select name="attributes[' + id + ']" class="form-control">' + options + '</select></td></tr>';
    } else if (type == 'radio') {
        var options = '';
        $.each(mapping.attribute.options, function (index, option) {
            options += '<input type="radio" name="attributes[' + id + ']" value="' + option.id + '"> ' + option.option + '<br>';
        });
        var row = '<tr><td>' + name + '</td><td>' + options + '</td></tr>';
    } else if (type == 'checkbox') {
    var options = '';
    $.each(mapping.attribute.options, function (index, option) {
        options += '<input type="checkbox" name="attributes[' + id + '][' + option.id + ']" value="' + option.id + '"> ' + option.option + '<br>';
    });
    var row = '<tr><td>' + name + '</td>' +
        '<td>' + options + '</td></tr>';
    }
    $('#attributesTable tbody').append(row);
}
