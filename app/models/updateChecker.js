/**********************************
CHECKER CONFIG 
ID       type Name
------------------------------------
1		get School List	 
2 		get Curriculum Post List 	  
3 		get Homework List 
4       get School List
************************************/

exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER",
		    "item_id" : "INTEGER",
		    "typeName": "TEXT",
		    "updated": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "updateChecker"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			getCheckerById : function(id, item_id){
				var collection = this;
				item_id = item_id || "";
               	var addItem = "";
				if(item_id != ""){
					addItem = " AND item_id = "+item_id;
				}
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "' "+addItem ;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    typeName: res.fieldByName('typeName'),
					    updated: res.fieldByName('updated')
					};
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			updateModule : function (id,typeName, updateDate , item_id){
				var collection = this;
				var addItem = "";
				item_id = item_id || "";
				if(item_id != ""){
					addItem = " AND item_id = "+item_id;
				}
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id="+ id +addItem ;
                var sql_query =  "";
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
             
                if (res.isValidRow()){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET updated='"+updateDate+"' WHERE id='" +id+"' " +addItem ;;
                }else{
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, typeName, updated, item_id) VALUES ('"+id+"','"+typeName+"','"+updateDate+"','"+item_id+"')" ;
				}
       			 
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
			}
		});

		return Collection;
	}
};