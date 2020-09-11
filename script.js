$(document).ready(function() {
  $('.drink-item').find('.edit').on('click', function() {
    $(this).closest('.drink-item').enterEditMode();
  });
  
  $('.custom-radio').on('click', function() {
    $(this).siblings('.hidden-radio').get(0).setAttribute('checked', 'true');
    var optionClass = $(this).attr('refValue');
    if (optionClass == 'regular') {
      $('input#type-diet').get(0).removeAttribute('checked');
      $(this).closest('.drink-item').find('.color-sample').removeClass('diet');
      $(this).closest('.drink-item').attr('drinkType', 'regular');
    } else {
      $('input#type-regular').get(0).removeAttribute('checked');
      $(this).closest('.drink-item').find('.color-sample').addClass('diet');
      $(this).closest('.drink-item').attr('drinkType', 'diet');
    }
  });
  
  $('#enter-reorder-mode').on('click', function() {
    enterReorderMode();
  });
  
  $('.add-drink-item').on('click', function() {
    addNewDrink();
  });
  
  $('.drink-item').find('.remove').on('click', function() {
    $(this).closest('.drink-item').deleteItem();
  });
  
});

$.fn.enterEditMode = function() {
  var drinkName = $(this).attr('drinkName');
  var drinkColor = $(this).attr('drinkColor');
  var isDiet = false;
  if (($(this).attr('drinkType'))=='diet') {
    isDiet = true;
  }
  
  $(this).find('.view-mode').css('display', 'none');
  
  $('.add-drink-item').hide();
  $('.button.done').css('opacity','0.25');
  $('#enter-reorder-mode').unbind().css('opacity','0.25');
  

  var editContent = document.getElementById('edit-mode');
  $(this).append(editContent);
  $(this).addClass('add-edit-drink');
  $(this).find('.edit-content').css({
    'display': 'flex',
    'flex-direction': 'column'
  });
  
  $(this).find('#name').val(drinkName);
  $(this).find('#color').val(drinkColor);
  $(this).find('.color-sample').css('background-color', drinkColor);
  
  document.getElementById('type-regular').removeAttribute('checked');
  document.getElementById('type-diet').removeAttribute('checked');
  
  if (isDiet) {
    document.getElementById('type-diet').setAttribute('checked', 'true');
    $(this).find('.color-sample').addClass('diet');
  } else {
    document.getElementById('type-regular').setAttribute('checked', 'true');
    $(this).find('.color-sample').removeClass('diet');
  }
  
  $('a.button.cancel').on('click', function() {
    $(this).closest('.drink-item').cancelEditMode();
  });
  $('a.button.save').on('click', function() {
    $(this).closest('.drink-item').saveEditMode();
  });
}

$.fn.cancelEditMode = function() {
  cleanUpAfterAddOrEdit();
  $(this).find('.view-mode').css('display', 'flex');
  $(this).removeClass('add-edit-drink');
  $('.add-drink-item').show();
}

$.fn.saveEditMode = function() {
  $(this).updateView();
  $(this).find('.view-mode').css('display', 'flex');
  $(this).removeClass('add-edit-drink');
  $('.add-drink-item').show();
  
  cleanUpAfterAddOrEdit();
}

$.fn.updateView = function() {
  var drinkDetails = getDrinkFormDetails();
  
  $(this).attr('drinkName', drinkDetails['name']);
  $(this).attr('drinkColor', drinkDetails['color']);
  $(this).attr('drinkType', drinkDetails['type']);
  
  if (drinkDetails['type'] == 'diet') {
    $(this).find('.color-sample').addClass('diet');
  } else {
    $(this).find('.color-sample').removeClass('diet');
  }
  $(this).find('.name').html(drinkDetails['name']);
  $(this).find('.color-sample').css('background-color', drinkDetails['color']);
}

function enterReorderMode() {
  $('body').removeClass('edit-mode').addClass('reorder-mode');
  $('.drink-item').addClass('reorder-unselected');
  $('.header .button.done').html('<i class="far fa-check"></i> Done');
  $('.reorder-unselected').on('click', function() {
    $('.reorder-selected').removeClass('reorder-selected').addClass('reorder-unselected');
    $(this).selectItemForReorder();
  });
  $('.button.done').on('click', function() {
    exitReorderMode();
  });
}

function exitReorderMode() {
  $('body').removeClass('reorder-mode').addClass('edit-mode');
  $('.header .button.done').html('<i class="far fa-times"></i> Close');
  $('drink-item').removeClass('reorder-unselected').removeClass('reorder-selected');
}


$.fn.selectItemForReorder = function() {
  $(this).removeClass('reorder-unselected').addClass('reorder-selected');
  $(this).evaluatePosition();
}

$.fn.evaluatePosition = function() {
  var currentPosition = parseInt($(this).attr('position'));
  
  var totalLength = $('.drink-item').length;
  
  $('.reorder-arrow').unbind();
  
  if (currentPosition > 0) {
    $('.reorder-up').addClass('active');
  } else {
    $('.reorder-up').removeClass('active');
  }
  if (currentPosition < totalLength-1) {
    $('.reorder-down').addClass('active');
  } else {
    $('.reorder-down').removeClass('active').off();
  }
  
  $('.reorder-arrow.active').on('click', function(e) {
    var direction = $(this).attr('direction');
    reorderInList(direction, currentPosition);
  });
}

function reorderInList(direction, position) {
  console.log(direction, position);
  
  $this = $('.reorder-selected');
  
  if (direction == "down") {
    $next = $('.drink-item').eq(position+1);
    $next.attr('position', position);
    $this.insertAfter($next);
    $this.attr('position', position+1);
  } else {
    $prev = $('.drink-item').eq(position-1);
    $prev.attr('position', position);
    $this.insertBefore($prev);
    $this.attr('position', position-1);
  }
  
  $this.evaluatePosition();
}

function addNewDrink() {
  $('.add-drink-item').hide();
  $('.button.done').css('opacity','0.25');
  $('#enter-reorder-mode').unbind().css('opacity','0.25');

  var editContent = document.getElementById('edit-mode');
  $('.col-right').append('<div class="drink-item add-new-drink"></div>');
  $('.add-new-drink').append(editContent);
  $('.add-new-drink').find('.edit-content').css({
    'display': 'flex',
    'flex-direction': 'column'
  });
  $('.add-new-drink').find('.edit-content').find('#name').val('');
  $('.add-new-drink').find('.edit-content').find('#color').val('#4E5B67');
  $('.add-new-drink').find('.edit-content').find('.color-sample').css('background-color', '#4E5B67').removeClass('diet');
  $('.add-new-drink').find('.edit-content').find('#type-regular').get(0).setAttribute('checked', true);
  $('.add-new-drink').find('.edit-content').find('#type-diet').get(0).removeAttribute('checked');
  $('a.button.cancel').on('click', function() {
    cancelAddMode();
  });
  $('a.button.save').on('click', function() {
    console.log('save button clicked');
    saveAddMode();
  });

}

function getDrinkFormDetails() {
  var drinkName = $('#edit-mode').find('#name').val();
  var drinkColor = $('#edit-mode').find('#color').val();
  var drinkType = '';
  if ($('#edit-mode').find('#type-diet').attr('checked')) {
    console.log('diet is checked');
    drinkType = 'diet';
    $('#edit-mode').find('.color-sample').addClass('diet');
  } else {
    console.log('regular is checked');
    drinkType = 'regular';
    $('#edit-mode').find('.color-sample').removeClass('diet');
  }
  var drinkDetails = {
    'name': drinkName,
    'color': drinkColor,
    'type': drinkType
  };
  return drinkDetails;
}

function cancelAddMode() {
  cleanUpAfterAddOrEdit();
  $('.add-drink-item').show();
  $('.add-new-drink').remove();
  $(this).find('.view-mode').css('display', 'flex');
  $('.add-drink-item').show();
}

function cleanUpAfterAddOrEdit() {
  var editContent = document.getElementById('edit-mode');
  $('html').append(editContent);
  $('#edit-mode').css('display', 'none');
  
  // Enable buttons that were disabled
  $('.button.done').css('opacity', '1');
  $('#enter-reorder-mode').on('click', function() {
    enterReorderMode();
  }).css('opacity', '1');
  
  // Unbind event handlers in Edit/Add form
  $('a.button.cancel').unbind();
  $('a.button.save').unbind();
}

function saveAddMode() {
  
  if ($('#edit-mode').find('#name').val() == '') {
    $('#edit-mode').find('#name').css('border', '2px solid #C3272B');
    return;
  } else {
    $('#edit-mode').find('#name').css('border', 'none');
  }

  var $newView = $('.new-item').detach()

  var newPosition = $('.drink-item').length-1;
  $('.add-drink-item').show();

  $newView.insertBefore($('.add-drink-item'));
  $('.new-item').show().updateView();
   
  cleanUpAfterAddOrEdit();
  $('.add-new-drink').remove();
  console.log('new drink frame removed');
}

$.fn.deleteItem = function() {
  var name = $(this).attr('drinkName');
  $('.overlay').css('display', 'flex');
  $('.overlay').find('.drink-name-to-delete').html(name);
  
  $('.overlay .button').on('click', function() {
    $('.overlay').css('display', 'none');
  });
}