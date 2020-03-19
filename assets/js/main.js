$(window).on('load',function(){
    $('#welcome').modal('show');
});
function copyClipboard(jenis) {
    var clipboard = $(`#clipboard_${jenis}`);
    clipboard.select();
    document.execCommand("copy");
    alert("berhasil");
}

function generate(){
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
            migrations += `$table->string('${list_column[i]}');\n            `
        }
    }
    res_model.text(`<?php

namespace App;
    
use Illuminate\\Database\\Eloquent\\Model;
    
class ${table.val().charAt(0).toUpperCase() + table.val().substr(1)} extends Model{
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
use App\\${table.val().charAt(0).toUpperCase() + table.val().substr(1)};
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
            
            $table->bigIncrements('id');
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
}