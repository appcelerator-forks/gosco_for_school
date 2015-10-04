exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY AUTOINCREMENT", 
		    "u_id": "INTEGER", 
		    "subject": "TEXT",
		    "created"  : "TEXT",
		    "updated"  : "TEXT"
		},

		adapter: {
			type: "sql",
			collection_name: "subjects",
			idAttribute: "id"
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
			 
  			 
			getSubjectByUser : function(u_id, searchKey){
				var collection = this;
				var search = ""; 
				if(searchKey != ""){
					search = " AND subject LIKE'%"+searchKey +"%' "; 
				}
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE u_id='"+ u_id+ "' "+search + " ORDER BY subject "  ; 
               
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = { 
						id: res.fieldByName('id'),
					    subject: res.fieldByName('subject'), 
					    created: res.fieldByName('created'), 
					    updated: res.fieldByName('updated') 
					};
					res.next();
					count++;
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
            
            saveArray : function(arr){
				 var collection = this;
           
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
               
                if (arr.id != ""){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET subject='"+arr.subject+"' , updated='"+COMMON.now()+"' WHERE id='"+ arr.id+"'";
                }else{
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " ( u_id, subject , created, updated) VALUES ('"+arr.u_id+"','"+arr.subject+"','"+COMMON.now()+"','"+COMMON.now()+"')" ;
				}
           		
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
			},
			 removeSubject : function(e){
            	var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name + " WHERE id='"+e.id+"' ";
                console.log(sql);
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute(sql);
                db.close();
                collection.trigger('sync');
            }
		}); 
					    
		return Collection;
	}
};