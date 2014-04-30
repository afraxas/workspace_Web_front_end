/**
 * Created by choi on 14. 1. 3.
 * required
 * 1.colModel key :true
 * 2. datatype ==="local" or loadonce === true
 * 3. localMultiselect === true
 * 4. lmsInit() call
 *
 */

;(function($){
    "use strict";
    $.jgrid.extend({
        lmsInit: function(){
            var $t = this[0];
            var $$t = $($t);
            var colModel = $t.p.colModel;
            var pin = $t.p.prmNames.id;
            var pidName;
            if(!$t.grid) { return; }
            if(!$t.p.localMultiselect){ return ;} //localMultiselect true check
            for(var i =0; i<$t.p.colModel.length; i++){
                if(colModel[i].name === pin){
                    pidName = colModel[i].name;
                    break;
                }
            }

            if($t.p.keyName === false ){  return }

            // TODO loadonce 또는 datatype 확인 p.datatype="local" or p.loadonce === true
            $t.p.dataSelarrrow=[];
            $t.p.dataExtraSelarrrow=$t.p.data.slice(0);
            //$t.p.dataSelarrrow = $t.p.data.slice(0); // local data deep clone

            $('#cb_'+$.jgrid.jqID($t.p.id)).on('click',function(){
                if (this.checked) {
                    $t.p.dataSelarrrow = $t.p.data.slice(0);
                    //splice ??
//                    delete $t.p.dataExtraSelarrrow;
                    $t.p.dataExtraSelarrrow = [];
                }else{
                    $t.p.dataExtraSelarrrow = $t.p.data.slice(0);
                    //delete  $t.p.dataSelarrrow;
                    $t.p.dataSelarrrow = [];
                }
            });

            var _onSelectRow = $t.p.onSelectRow;
            $t.p.onSelectRow = function(){
                var args = $.makeArray(arguments).slice(0);
                _onSelectRow.apply(this, args);
                $$t.lmsOnSelectRow.apply(this, args);
            }
            var _loadComplete = $t.p.loadComplete===null ? function(){}: $t.p.loadComplete;
            //args = $.makeArray(arguments).slice(1);
            $t.p.loadComplete = function(){
                var args = $.makeArray(arguments).slice(0);
                _loadComplete.apply(this, args);
                $$t.lmsLoadComplete.apply(this, args);
            }
        },

        lmsOnSelectRow : function(rowid,status,e){
            var $t = this;
            var $$t = $($t);
            var selObj = $$t.getRowData(rowid);
            var selarr = $t.p.dataSelarrrow;
            var selExtraarr = $t.p.dataExtraSelarrrow;
            var idname = $t.p.keyName;
            if(status){
                selarr.push(selObj);
                for(var i=0,MAX=selExtraarr.length ;i<MAX ;i++){
                    if(selExtraarr[i][idname] == rowid){
                        selExtraarr.splice(i,1);
                        break;
                    }
                }
            }else{
               selExtraarr.push(selObj);
                for(var i=0,MAX=selarr.length ;i<MAX ;i++){
                    if(selarr[i][idname] == rowid){
                        //속도 이슈가 있나 undefined로 해야 하나?? 우선 해보자
                        selarr.splice(i,1);
                        break;
                    }
                }
            }
        },
        lmsLoadComplete : function(data){
            var $t = this;
            var $$t = $($t);
            var selarr = $t.p.dataSelarrrow;
            var data = $t.p.data;
            var idname = $t.p.keyName;
            var rowId = "";

            for(var a = 0 ,MAX = selarr.length;a < MAX;a++){
                rowId = ""+selarr[a][idname];
                if($($$t.getInd(""+rowId,true)).attr("aria-selected") == undefined){
                    $$t.setSelection(rowId,false);
                }
            }
            if(selarr.length > 0 && selarr.length === data.length ){
                $('#cb_'+$.jgrid.jqID($t.p.id),$t.grid.hDiv)[$t.p.useProp ? 'prop': 'attr']("checked", true);
            }

        },
        lmsGetSelarr : function(selDel){
            var $t = this[0];
            var $$t = $($t);
            var selarr = $t.p.dataSelarrrow;
            var selExtraarr = $t.p.dataExtraSelarrrow;
            var cloneSelarr = $t.p.dataSelarrrow.slice();
            var selExtraarrClone = $t.p.dataExtraSelarrrow.slice();
            selDel === true ? true:false;
            if(selDel){
                //선택된 데이터를 가져와서 리턴하고 화면 grid에서도 삭제
                $t.p.dataSelarrrow = [];
                $$t.setGridParam({ datastr: selExtraarrClone, datatype:'jsonstring'}).trigger('reloadGrid');
                return cloneSelarr;
            }else{
                //선택된 데이터만을 리턴
                return selarr;
            }
        }
    });
})(jQuery);
