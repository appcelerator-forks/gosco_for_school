exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY",
		    "h_id": "INTEGER",
		    "img_path": "TEXT",  
		    "img_thumb": "TEXT",  
		    "created": "TEXT",
		    "updated": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "homeworkAttachment"
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
			addColumn : function( newFieldName, colSpec) {
				var collection = this;
				var db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
				var fieldExists = false;
				resultSet = db.execute('PRAGMA TABLE_INFO(' + collection.config.adapter.collection_name + ')');
				while (resultSet.isValidRow()) {
					if(resultSet.field(1)==newFieldName) {
						fieldExists = true;
					}
					resultSet.next();
				}
			 	if(!fieldExists) { 
					db.execute('ALTER TABLE ' + collection.config.adapter.collection_name + ' ADD COLUMN '+newFieldName + ' ' + colSpec);
				}
				db.close();
			},
			// extended functions and properties go here
			getRecordByHomework: function(h_id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE  h_id='"+h_id+"' ";
                console.log(sql);
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var listArr = []; 
                var count = 0;
                while (res.isValidRow()){ 
					listArr[count] = { 
							id: res.fieldByName('id'),
						    h_id: res.fieldByName('h_id'), 
						    img_path: res.fieldByName('img_path'), 
						    img_thumb: res.fieldByName('img_thumb'), 
						    created: res.fieldByName('created'),
						    updated: res.fieldByName('updated') 
					};	
					 
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return listArr;
			},
			 
			removeRecordById : function(id){
				var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute(sql);
                db.close();
                collection.trigger('sync');
			},
			removeRecordByRec : function(h_id){
				var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name + " WHERE h_id='"+ h_id+ "'" ;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute(sql);
                db.close();
                collection.trigger('sync');
			}, 
			saveArray : function(arr){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
        		arr.forEach(function(hw) {
        			var attList = hw.attachment;
        			console.log(attList);
					attList = attList || "";
					if(attList == ""){
						return false;
					}
					attList.forEach(function(entry) {
			            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, h_id, img_path, img_thumb,created,updated) VALUES (?,?,?,?,?,? )";
						db.execute(sql_query, entry.id, entry.h_id,  entry.img_path,entry.img_thumb,entry.created,entry.updated);
						var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET h_id=?,img_path=?,img_thumb=? ,updated=? WHERE id=?";
						db.execute(sql_query, entry.h_id,entry.img_path,  entry.img_thumb ,entry.updated, entry.id);
				 		console.log(sql_query);
				 	});
			 	});
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
			addAttachment : function(entry) {
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
	            if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                } 
	 
		   		sql_query = "INSERT INTO "+ collection.config.adapter.collection_name + "( id,h_id,img_path,img_thumb, created, updated ) VALUES ( '"+entry.id+"', '"+entry.h_id+"', '"+entry.img_path+"', '"+entry.img_thumb+"', '"+entry.created+"', '"+entry.updated+"')";
				 
				db.execute(sql_query);
				  
	            db.close();
	            collection.trigger('sync');
            }
		});

		return Collection;
	}
};  