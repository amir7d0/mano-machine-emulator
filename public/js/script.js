"use strict";
let index = 0;
let jsonData = {};
(($) => {
    $("form").submit(e => {
        e.preventDefault();
        $('#getInput').addClass('d-none');
        $('footer').addClass('d-none');
        let _inputFileText = $('#inputCode').val();
        $.ajax({
            type: "post",
            url: "/",
            dataType: "json",
            // data: JSON.stringify({
            //     inputFileText: _inputFileText
            // }),
            // data: _inputFileText,
            data: {
                inputFileText: _inputFileText
            },
            success: (data) => {
                console.log(data);
                jsonData = data;
                runHandler(data);
            },
            error: (err) => {
                console.error(err);
                window.alert(err);
            }
        });
    });
    $("#next").on('click', e => {
        handleNext(e.currentTarget);
    });
    $("#prev").on('click', e => {
        handlePrev(e.currentTarget);
    });
    $("#reset").on('click', e => {
        window.location.reload();
    });
    $("#first").on('click', e => {
        $(".register input").each((i, elem) => {
            $(elem).val(0);
        });
        index = 0;
        updateRegisters();
    });
    $("#last").on('click', e => {
        for (let i = index; i < jsonData.output.registerChanges.length; i++) {
            updateRegisters();
        }
    })
})(jQuery);
const runHandler = (json) => {
    // filling program table'
    const programTable = $("table#program tbody");
    $(json.input.split("\n")).each((i, elem) => {
        if(elem !== "") {
            programTable.append($(`<tr><td>${elem}</td></tr>`));
        }
    });
    // filling address table
    let addressTable = $("table#address");
    $(Object.keys(jsonData.output.addressTable)).each((i, elem) => {
        addressTable.append(`<tr><td>${elem}</td><td>${jsonData.output.addressTable[elem]}</td></tr>`)
    });
    // initializing registers
    updateRegisters(index);
    // filling usedMemory table
    const usedMemTable = $("table#usedMem");
    let tmp;
    $(Object.keys(jsonData.output.usedMemory[0])).each((i, elem) => {
        tmp = jsonData.output.usedMemory[0][elem];
        // usedMemTable.append(`<tr><td class="address-index">${elem}</td><td>${tmp[0].replace(/b/gi, "")}</td><td class="address-value">${tmp[1]}</td><td>${tmp[2]}</td><td>${tmp[3]}</td></tr>`);
        if(tmp[2].search(/(\sI\s)|(\sI$)/gi) === -1) {
            usedMemTable.append(`<tr><td class="address-index">${elem}</td><td>${tmp[0].replace(/b/gi, "")}</td><td class="address-value">${tmp[1]}</td><td>${tmp[2]}</td><td>${tmp[3]}</td></tr>`);
        } else {
            usedMemTable.append(`<tr><td class="address-index">${elem}</td><td class="indirect">${tmp[0].replace(/b/gi, "")}</td><td class="address-value">${tmp[1]}</td><td>${tmp[2]}</td><td>${tmp[3]}</td></tr>`);
        }
    });
    // filing totalMemory table
    const totalMem = $("#memory");
    $(Object.keys(jsonData.output.totalMemory[0])).each((i, elem) => {
        totalMem.append(`<tr><td>${i}</td><td class="address-index">${elem}</td><td class="address-value">${jsonData.output.totalMemory[0][elem]}</td></tr>`);
    });
    // display results
    $('#computerDetails').removeClass('d-none');
    $('footer').removeClass('d-none');
};
const updateRegisters = () => {
    if(!(index >= 0 && index < jsonData.output.registerChanges.length)) {
        return;
    }
    $(Object.keys(jsonData.output.registerChanges[index])).each((i, elem) => {
        $(`#${elem} input[type=text]`).val(jsonData.output.registerChanges[index][elem]);
        if(elem === "memory") {
            let s = jsonData.output.registerChanges[index][elem].split("@");
            $('.address-index').each((i, elem) => {
                if(elem.innerText === s[1]) {
                    $(elem).parent().find('.address-value').val(s[0]);
                }
            });
        }
    });
    index++;
    // handle witch button should be disabled
    // next
    if(index >= jsonData.output.registerChanges.length) {
        $('#next').prop('disabled', true).addClass('disabled');
    } else {
        $('#next').prop('disabled', false).removeClass('disabled');
    }
    // prev
    if(index - 1 <= 0) {
        $('#prev').prop('disabled', true).addClass('disabled');
    } else {
        $('#prev').prop('disabled', false).removeClass('disabled');
    }
};
const handleNext = (elem) => {
    updateRegisters();
};
const handlePrev = (elem) => {
    let saveIndex = index;
    index = 0;
    $(".register input").each((i, elem) => {
        $(elem).val(0);
    });
    for(let i = 0; i <= saveIndex - 2; i++) {
        updateRegisters();
    }
};
const tabFunc = (elem) => {
    $('.tabs li').toggleClass('active');
    $('.tab-content').toggleClass('d-none');
};