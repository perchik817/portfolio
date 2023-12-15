$(document).ready(function() {
      // Возвращает случайное целое число между min (включительно) и max (не включая max)
      function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
      }

      var table_main = document.getElementById('sapper_table_main');
      var count_bomb = Number($('#sapper_count_bombs').val());
      var count_tr = Number($('#sapper_count_tr').val());
      var count_tr_td = Number($('#sapper_count_td').val());
      var span_minutes = $('span#sapper_minutes');
      var span_seconds = $('span#sapper_seconds');
      var sapper_timer;
      var count_td = count_tr * count_tr_td;
      var count_cell_close = count_td;
      var end_game = false;
      var arr_count_td = [];
      var obj_all_td = {};

      function fill_obj_all_td() {
            for (var i = 0; i < count_td; i++) {
            arr_count_td.push(i);
            obj_all_td[i] = {}
            obj_all_td[i]['bomb'] = false;
            obj_all_td[i]['numeric'] = false
            obj_all_td[i]['open'] = false
            obj_all_td[i]['flag'] = false
            if (i % count_tr_td == 0 || i == 0) {
                  obj_all_td[i]['edge'] = 'left';
            } else if ((i + 1) % count_tr_td == 0) {
                  obj_all_td[i]['edge'] = 'right';
            } else {
                  obj_all_td[i]['edge'] = false;
            }
            }
      }

      fill_obj_all_td();

      function add_bomb_obj_all_td() {
            var number_bomb;
            for (var i = 0; i < count_bomb; i++) {
            number_bomb = Math.round(getRandomInt(0, arr_count_td.length));
            number_bomb = arr_count_td.splice(number_bomb, 1)[0];
            obj_all_td[number_bomb]['bomb'] = true;
            }
      }

      add_bomb_obj_all_td();

      function add_siblings_and_numeric() {
            for (var td_i in obj_all_td) {
            var td_i_num = Number(td_i);
            var arr_sibling_number_td = [td_i_num - 1, td_i_num + 1, td_i_num - count_tr_td, td_i_num - count_tr_td - 1, td_i_num - count_tr_td + 1, td_i_num + count_tr_td, td_i_num + count_tr_td - 1, td_i_num + count_tr_td + 1];
            var arr_sibling_td = [];
            for (var j = 0; j < arr_sibling_number_td.length; j++) {
                  if (arr_sibling_number_td[j] >= 0 && arr_sibling_number_td[j] < count_td) {
                        if (!obj_all_td[td_i]['edge']) {
                        arr_sibling_td.push(arr_sibling_number_td[j]);
                        if (obj_all_td[td_i]['bomb'] && !obj_all_td[arr_sibling_number_td[j]]['bomb']) {
                              obj_all_td[arr_sibling_number_td[j]]['numeric'] = true
                        }
                        } else if (obj_all_td[td_i]['edge'] === 'left' && obj_all_td[arr_sibling_number_td[j]]['edge'] !== 'right') {
                        arr_sibling_td.push(arr_sibling_number_td[j]);
                        if (obj_all_td[td_i]['bomb'] && !obj_all_td[arr_sibling_number_td[j]]['bomb']) {
                              obj_all_td[arr_sibling_number_td[j]]['numeric'] = true
                        }
                        } else if (obj_all_td[td_i]['edge'] === 'right' && obj_all_td[arr_sibling_number_td[j]]['edge'] !== 'left') {
                        arr_sibling_td.push(arr_sibling_number_td[j]);
                        if (obj_all_td[td_i]['bomb'] && !obj_all_td[arr_sibling_number_td[j]]['bomb']) {
                              obj_all_td[arr_sibling_number_td[j]]['numeric'] = true
                        }
                        }

                  }
            }
            obj_all_td[td_i]['siblings'] = arr_sibling_td;

            var arr_sibling_direct_num_td = [td_i_num - 1, td_i_num + 1, td_i_num - count_tr_td, td_i_num + count_tr_td];
            var arr_sibling_direct_td = [];
            for (var j = 0; j < arr_sibling_direct_num_td.length; j++) {
                  if (arr_sibling_direct_num_td[j] >= 0 && arr_sibling_direct_num_td[j] < count_td) {
                        if (!obj_all_td[td_i]['edge']) {
                        arr_sibling_direct_td.push(arr_sibling_direct_num_td[j]);
                        } else if (obj_all_td[td_i]['edge'] === 'left' && obj_all_td[arr_sibling_direct_num_td[j]]['edge'] !== 'right') {
                        arr_sibling_direct_td.push(arr_sibling_direct_num_td[j]);
                        } else if (obj_all_td[td_i]['edge'] === 'right' && obj_all_td[arr_sibling_direct_num_td[j]]['edge'] !== 'left') {
                        arr_sibling_direct_td.push(arr_sibling_direct_num_td[j]);
                        }
                  }
            }
            obj_all_td[td_i]['siblings_direct'] = arr_sibling_direct_td;
            }
      }

      add_siblings_and_numeric()


      function createTable() {
            var n = 0
            for (var i = 0; i < count_tr; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < count_tr_td; j++) {
                  var td = document.createElement('td');
                  if (obj_all_td[n]['bomb']) {
                        obj_all_td[n]['text'] = '<img src="assets/img/bomb.png" />';
                  } else if (obj_all_td[n]['numeric']) {
                        num_col = 0;
                        for (var m = 0; m < obj_all_td[n]['siblings'].length; m++) {
                        if (obj_all_td[obj_all_td[n]['siblings'][m]]['bomb'])
                              num_col++;
                        }
                        obj_all_td[n]['text'] = num_col;
                  }

                  if (!obj_all_td[n]['bomb'] && !obj_all_td[n]['numeric']) {
                        obj_all_td[n]['text'] = '';
                  }

                  tr.appendChild(td);
                  n++;
            }
            table_main.appendChild(tr);
            }
      }

      createTable();


//console.log(obj_all_td);
//console.log(arr_count_td);

      var td_all = $(table_main).find('td');

      function openCellRecurs(td, number) {
            openCellOne(td, number)
            if (obj_all_td[number]['bomb'] === false && obj_all_td[number]['numeric'] === false) {
            for (var i = 0; i < obj_all_td[number]['siblings_direct'].length; i++) {
                  if (obj_all_td[obj_all_td[number]['siblings_direct'][i]]['bomb'] === false && obj_all_td[obj_all_td[number]['siblings_direct'][i]]['numeric'] === false && obj_all_td[obj_all_td[number]['siblings_direct'][i]]['open'] === false) {
                        openCellRecurs(td_all.eq(obj_all_td[number]['siblings_direct'][i]), obj_all_td[number]['siblings_direct'][i]);
                  } else if (obj_all_td[obj_all_td[number]['siblings_direct'][i]]['numeric'] === true && obj_all_td[obj_all_td[number]['siblings_direct'][i]]['open'] === false) {
                        openCellOne(td_all.eq(obj_all_td[number]['siblings_direct'][i]), obj_all_td[number]['siblings_direct'][i]);
                  }
            }
            }
      }

      function openCellOne(td, number) {
            if (!obj_all_td[number]['open']) {
            td.css('background', 'none');
            td.html(obj_all_td[number]['text']);
            obj_all_td[number]['open'] = true;
            count_cell_close--;
            if (count_cell_close == count_bomb && !end_game) {
                  end_game = true;
                  window.clearInterval(sapper_timer);
                  showMessage('Победа!!!<br>Время: ' + $('div#sapper_time').html(), 'green');
                  openAll();
            }
            }
      }

      $(table_main).on('click', 'td', function () {
            if (count_cell_close === count_td) {
            goTimer();
            }
            var this_number = $(table_main).find('td').index($(this));
            if (obj_all_td[this_number]['bomb']) {
            end_game = true;
            window.clearInterval(sapper_timer);
            openAll();
            $(this).css('background', 'red');
            showMessage('Вы Проиграли<br>Время: ' + $('div#sapper_time').html(), 'red')
            } else {
            openCellRecurs($(this), this_number);
            }
      })

      $(table_main).on('contextmenu', 'td', function (e) {
            e.preventDefault();
            var this_number = $(table_main).find('td').index($(this));
            if (!obj_all_td[this_number]['open']) {
            if (!obj_all_td[this_number]['flag']) {
                  obj_all_td[this_number]['flag'] = true;
                  $(this).html('<img src="assets/img/flag.png" />')
            } else {
                  obj_all_td[this_number]['flag'] = false;
                  $(this).html('')
            }
            }


      })

      function openAll() {
            for (var i = 0; i < count_td; i++) {
            openCellOne(td_all.eq(i), i);
            }
      }


      $('#sapper_new_game').on('click', function () {
            span_seconds.text('00');
            span_minutes.text('00');
            $('.sapper_message').remove();
            count_bomb = Number($('#sapper_count_bombs').val());
            count_tr = Number($('#sapper_count_tr').val());
            count_tr_td = Number($('#sapper_count_td').val())
            count_td = count_tr * count_tr_td;
            count_cell_close = count_td;
            end_game = false;
            arr_count_td = [];
            obj_all_td = {};

            fill_obj_all_td();
            add_bomb_obj_all_td();
            add_siblings_and_numeric();

            $(table_main).empty();
            createTable();
            td_all = $(table_main).find('td');
      })

      function showMessage(message, color) {
            var table_main_width = $(table_main).width();
            var table_main_height = $(table_main).height();
            var divMessage = $('<div></div>', {'class': 'sapper_message'}).appendTo($('div#sapper_wrapper'));
            divMessage.css({'width': table_main_width + 'px', 'height': table_main_height + 'px'})
            var pMessage = $('<p></p>', {'html': message}).appendTo(divMessage);
            pMessage.css('color', color);
      }

      function goTimer() {
            span_seconds.text('00');
            span_minutes.text('00');
            sapper_timer = window.setInterval(function () {
            var num_seconds = Number(span_seconds.text()) + 1;
            var num_minutes = Number(span_minutes.text());
            if (num_seconds < 10) {
                  num_seconds = '0' + num_seconds;
            } else if (num_seconds > 59) {
                  num_seconds = '00';
                  num_minutes++;
            }

            if (num_minutes < 10) {
                  num_minutes = '0' + num_minutes;
            }

            span_seconds.text(num_seconds);
            span_minutes.text(num_minutes);
            }, 1000);
      }

});      