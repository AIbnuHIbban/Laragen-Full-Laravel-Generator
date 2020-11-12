function clearFocus(){
    $('.clear').focus()
}
function kosongkan() {
    btn_example         = $('.example');
    btn_clear           = $('.clear');
    btn_example.removeClass('d-none');
    btn_clear.addClass('d-none');
    var res_model       = $('#result_models')
    var res_crud        = $('#result_crud')
    var res_migration   = $('#result_migration')
    res_model.text("");
    res_crud.text("");
    res_migration.text("");
    $('.table_name').focus()
}

function checkModal() {
    if($('#myModal').hasClass('in') === false){
        $('.table_name').focus()
    }
}

$(window).on('load',function(){
    $('#welcome').modal('show');
});


document.addEventListener('contextmenu', event => event.preventDefault());
$(document).keydown(function(e){
    if(e.which === 123){
       return false;
    }else if ((event.ctrlKey && event.shiftKey && event.keyCode == 73) || (event.ctrlKey && event.shiftKey && event.keyCode == 74)){
        return false;
    }else if (e.ctrlKey && e.keyCode == 85) {
        return false;
    }else if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        disabledEvent(e);
    }
});
$('textarea').keypress(function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        generate()
    }
});
function copyClipboard(jenis) {
    var clipboard = $(`#clipboard_${jenis}`);
    if (clipboard.text() === "") {
        Swal.fire(
            'Oopss..',
            `Please Fill In The Required Fields`,
            'error'
        )
    }else{
        clipboard.select();
        document.execCommand("copy");
        Swal.fire(
            'Copy To Clipboard!',
            `${jenis.charAt(0).toUpperCase() + jenis.substr(1)} Copied Successfully`,
            'success'
        )
    }
}

function generate(){
    btn_example         = $('.example');
    btn_clear           = $('.clear');
    var table           = $('#table_name')
    var list_column_val = $('#list_column').val()
    var list_column     = list_column_val.split(',')
    var res_model       = $('#result_models')
    var res_crud        = $('#result_crud')
    var res_migration   = $('#result_migration')
    var cp_model        = $('#clipboard_models')
    var cp_crud         = $('#clipboard_crud')
    var cp_migration    = $('#clipboard_migration')
    let kolom           = ""
    if (table.val() === "" || list_column_val === "") {
        Swal.fire(
            'Oopss..',
            `Please Fill In The Required Fields`,
            'error'
        )
    }else{
        for (let i = 0; i < list_column.length; i++) {
            if (i === list_column.length-1) {
                kolom += '"'+list_column[i]+'"'
            }else{
                kolom += '"'+list_column[i]+'",'
            }
        }
        let validasi           = ""
        for (let i = 0; i < list_column.length; i++) {
            if (i === list_column.length-1) {
                validasi += '"'+list_column[i]+'"         => "required"'
            }else{
                validasi += '"'+list_column[i]+'"         => "required",\n            '
            }
        }
        let data           = ""
        for (let i = 0; i < list_column.length; i++) {
            if (i === list_column.length-1) {
                data += `"${list_column[i]}"         => $request->${list_column[i]}`
            }else{
                data += `"${list_column[i]}"         => $request->${list_column[i]},\n            `
            }
        }
        let data_comment           = ""
        for (let i = 0; i < list_column.length; i++) {
            if (i === list_column.length-1) {
                data_comment += `//     "${list_column[i]}"         => $request->${list_column[i]}`
            }else{
                data_comment += `//     "${list_column[i]}"         => $request->${list_column[i]},\n        `
            }
        }
        let migrations           = ""
        for (let i = 0; i < list_column.length; i++) {
            if (i === list_column.length-1) {
                migrations += `$table->string('${list_column[i]}');`
            }else{
                migrations += `$table->string('${list_column[i]}');\n               `
            }
        }
        res_model.text(`<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;        
use Illuminate\\Database\\Eloquent\\Model;
    
class ${table.val().charAt(0).toUpperCase() + table.val().substr(1)} extends Model{
    use HasFactory;

    protected $table = "${table.val().toLowerCase().replace(" ", "_")}";

    protected $fillable = [${kolom}];

    /**
     * Create by LeeNuksID :D
     *
     * Thanks For Using Laragen
     */
}`)
        res_crud.text(`<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use App\\Models\\${table.val().charAt(0).toUpperCase() + table.val().substr(1)};
use Illuminate\\Support\\Facades\\Validator;
// use Illuminate\\Support\\Facades\\Auth;

class ${table.val().charAt(0).toUpperCase() + table.val().substr(1)}Controller extends Controller{

    public function store(Request $request){
        $validate = Validator::make($request->all(),[
            ${validasi}
        ]);

        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate);
        }

        $send = ${table.val().charAt(0).toUpperCase() + table.val().substr(1)}::create([
            ${data}
        ]);

        // $send = ${table.val().charAt(0).toUpperCase() + table.val().substr(1)}::insert([
        ${data_comment}
        // ]);
        
        // $send = ${table.val().charAt(0).toUpperCase() + table.val().substr(1)}::create($request->all());


        if ($send) {
            return redirect()->back();
        }
    }

    public function update(Request $request,$${table.val().toLowerCase()}){
        $validate = Validator::make($request->all(),[
            ${validasi}
        ]);

        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate);
        }

        $${table.val().toLowerCase()} = ${table.val().charAt(0).toUpperCase() + table.val().substr(1)}::find($${table.val().toLowerCase()});

        $array = [
            ${data}
        ];

        if ($${table.val().toLowerCase()}->update($array)) {
            return redirect()->back();
        }
    }

    public function destroy($${table.val().toLowerCase()}){
        $${table.val().toLowerCase()} = ${table.val().charAt(0).toUpperCase() + table.val().substr(1)}::find($${table.val().toLowerCase()});
        if ($${table.val().toLowerCase()}->delete()) {
            return redirect()->back();
        }
    }

    /**
     * Create by LeeNuksID :D
     *
     * Thanks For Using Laragen
     */
}`)
        res_migration.text(`<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

class ${table.val().charAt(0).toUpperCase() + table.val().substr(1)} extends Migration{

public function up(){
    Schema::create('${table.val().toLowerCase().replace(" ", "_")}', function (Blueprint $table) {        
        $table->id();
        ${migrations}
        $table->timestamps();

        // Options: See More at https://laravel.com/docs/5.8/migrations#creating-columns
        // integer
        // bigInteger
        // binary
        // boolean
        // char
        // date
        // dateTime
        // decimal
        // double
        // enum('level', ['easy', 'hard']);
        // float
        // longText
    });
}

public function down(){
    Schema::dropIfExists('${table.val().toLowerCase().replace(" ", "_")}');
}

/**
 * Create by LeeNuksID :D
 *
 * Thanks For Using Laragen
 */
    }`)
        
        cp_model.text('')
        cp_crud.text('')
        cp_migration.text('')
        cp_model.text(res_model.text())
        cp_crud.text(res_crud.text())
        cp_migration.text(res_migration.text())
        list_column_val = "";
        btn_example.addClass('d-none');
        btn_clear.removeClass('d-none');
        clearFocus()
    }
}

function example(){
    btn_example         = $('.example');
    btn_clear           = $('.clear');
    var table           = "Example"
    var res_model       = $('#result_models')
    var res_crud        = $('#result_crud')
    var res_migration   = $('#result_migration')
    var cp_model        = $('#clipboard_models')
    var cp_crud         = $('#clipboard_crud')
    var cp_migration    = $('#clipboard_migration')
    let kolom           = "'column1','column2','column3','column4','column5','column6','column7'"
    let validasi        = "'column1'        => 'required'"
    let data            = "'column1'        => $request->column1"
    let data_comment    = "// 'column1'        => $request->column1"
    let migrations      = "$table->string('column1')"
    res_model.text(`<?php
    
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
    
class ${table} extends Model{
    use HasFactory;

    protected $table = "${table.toLowerCase().replace(" ", "_")}";

    protected $fillable = [${kolom}];

    // public $timestamps = false;

    /**
     * Create by LeeNuksID :D
     *
     * Thanks For Using Laragen
     */
}`)
    res_crud.text(`<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use App\\Models\\${table};

class ${table}Controller extends Controller{

public function store(Request $request){
    $validate = Validator::make($request->all(),[
        ${validasi}
    ]);

    if ($validate->fails()) {
        return redirect()->back()->withErrors($validate);
    }

    $send = ${table.charAt(0).toUpperCase() + table.substr(1)}::create([
        ${data}
    ]);

    // $send = ${table.charAt(0).toUpperCase() + table.substr(1)}::insert([
    ${data_comment}
    // ]);
    
    // $send = ${table.charAt(0).toUpperCase() + table.substr(1)}::create($request->all());


    if ($send) {
        return redirect()->back();
    }
}

public function update(Request $request,$${table.toLowerCase()}){
    $validate = Validator::make($request->all(),[
        ${validasi}
    ]);

    if ($validate->fails()) {
        return redirect()->back()->withErrors($validate);
    }

    $${table.toLowerCase()} = ${table.charAt(0).toUpperCase() + table.substr(1)}::find($${table.toLowerCase()});

    $array = [
        ${data}
    ];

    if ($${table.toLowerCase()}->update($array)) {
        return redirect()->back();
    }
}

public function destroy($${table.toLowerCase()}){
    $${table.toLowerCase()} = ${table.charAt(0).toUpperCase() + table.substr(1)}::find($${table.toLowerCase()});
    if ($${table.toLowerCase()}->delete()) {
        return redirect()->back();
    }
}

/**
 * Create by LeeNuksID :D
 *
 * Thanks For Using Laragen
 */
}`)
    res_migration.text(`<?php
    
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

class ${table} extends Migration{
    
    public function up(){
        Schema::create('${table.toLowerCase().replace(" ", "_")}', function (Blueprint $table) {            
            $table->id();
            ${migrations}
            $table->timestamps();

            // Options: See More at https://laravel.com/docs/7.x/migrations#creating-columns
            // integer
            // bigInteger
            // binary
            // boolean
            // char
            // date
            // dateTime
            // decimal
            // double
            // enum('level', ['easy', 'hard']);
            // float
            // longText
        });
    }

    public function down(){
        Schema::dropIfExists('${table.toLowerCase().replace(" ", "_")}');
    }

    /**
     * Create by LeeNuksID :D
     *
     * Thanks For Using Laragen
     */
}`)
    
    btn_example.addClass('d-none');
    btn_clear.removeClass('d-none');
    cp_model.text('')
    cp_crud.text('')
    cp_migration.text('')
    cp_model.text(res_model.text())
    cp_crud.text(res_crud.text())
    cp_migration.text(res_migration.text())
}