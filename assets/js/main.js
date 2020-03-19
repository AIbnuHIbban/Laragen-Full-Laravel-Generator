function copyClipboard(jenis) {
    var clipboard = $(`#clipboard_${jenis}`);
    clipboard.select();
    document.execCommand("copy");
    alert("berhasil");
}

function generate() {
    var table           = $('#table_name')
    var list_column_val = $('#list_column').val()
    var list_column     = list_column_val.split(',')
    var res_model       = $('#result_models')
    var res_crud        = $('#result_crud')
    var res_migration   = $('#result_migration')
    let kolom           = ""
    for (let i = 0; i < list_column.length; i++) {
        if (i === list_column.length-1) {
            kolom += '"'+list_column[i]+'"'
        }else{
            kolom += '"'+list_column[i]+'",'
        }
    }
    res_model.text(`<?php

    namespace App;
    
    use Illuminate\\Database\\Eloquent\\Model;
    
    class ${table.val().charAt(0).toUpperCase() + table.val().substr(1)} extends Model{
        protected $table = "${table}";
    
        protected $fillable = ${kolom};
    
        /**
         * Create by LeeNuksID :D
         *
         * Thanks For Using Laragen
         */
    }
    `)

    res_crud.text(`<?php


namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use App\\NotulenRapat;
use Illuminate\\Support\\Facades\\Validator;
// use Illuminate\\Support\\Facades\\Auth;

class RapatController extends Controller{

    public function store(Request $request){
        $validate = Validator::make($request->all(),[
            'id_divisi'         => 'required|numeric',
        ]);

        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate);
        }

        $send = NotulenRapat::create([
            'id_user'           => Auth::user()->id,
        ]);

        // $send = NotulenRapat::insert([
        //    'id_user'           => Auth::user()->id,
        // ]);
        
        // $send = NotulenRapat::create($request->all());


        if ($send) {
            return redirect()->back();
        }
    }

    public function update(Request $request,$notulen){
        $validate = Validator::make($request->all(),[
            'id_divisi' => 'required|numeric',
        ]);

        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate);
        }

        $notulen = NotulenRapat::find($notulen);

        $array = [
            'id_divisi' => $request->id_divisi,
        ];

        if ($notulen->update($array)) {
            return redirect()->back();
        }
    }

    public function destroy($notulen){
        $notulen = NotulenRapat::find($notulen);
        if ($notulen->delete()) {
            return redirect()->back();
        }
    }

    /**
     * Create by LeeNuksID :D
     *
     * Thanks For Using Laragen
     */
}
`)
    res_migration.text(`<?php

    use Illuminate\\Database\\Migrations\\Migration;
    use Illuminate\\Database\\Schema\\Blueprint;
    use Illuminate\\Support\\Facades\\Schema;
    
    class Kelas extends Migration{
        
        public function up(){
            Schema::create('Kelas', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->integer('id_sekolah');
                $table->string('nama_kelas');
                $table->timestamps();
            });
        }
    
        public function down(){
            Schema::dropIfExists('Kelas');
        }
    
        /**
         * Create by LeeNuksID :D
         *
         * Thanks For Using Laragen
         */
    }
    `)
}