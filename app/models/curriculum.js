exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY", 
		    "curriculum": "TEXT", 
		    "e_id": "TEXT",
		    "type": "TEXT",
		    "description": "TEXT", 
		    "img_path" : "TEXT", 
		    'status': "INTEGER",
		    "created"  : "TEXT",
		    "updated"  : "TEXT"
		},

		adapter: {
			type: "sql",
			collection_name: "curriculum",
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
			getCurriculumById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
						id: res.fieldByName('id'),
					    e_id: res.fieldByName('e_id'),
					    curriculum: res.fieldByName('curriculum'),
					    type: res.fieldByName('type'),
					    description: res.fieldByName('description'),
					    status: res.fieldByName('status'), 
					    img_path: res.fieldByName('img_path'), 
					    created: res.fieldByName('created'), 
					    updated: res.fieldByName('updated') 
					};
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
  			 
			getCurriculumByEducation : function(e_id, searchKey){
				var collection = this;
				var search = ""; 
				if(searchKey != ""){
					search = " AND curriculum LIKE'%"+searchKey +"%' "; 
				}
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE e_id='"+ e_id+ "' AND status=1 "+search ; 
                
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
					    e_id: res.fieldByName('e_id'),
					    curriculum: res.fieldByName('curriculum'),
					    type: res.fieldByName('type'),
					    description: res.fieldByName('description'),
					    status: res.fieldByName('status'), 
					    img_path: res.fieldByName('img_path'), 
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
            updateAttachment : function(arr){
            	var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }  
        		var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET img_path=? WHERE id=?";
				db.execute(sql_query,  arr.img_path , arr.c_id);
			  
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
        		arr.forEach(function(entry) {
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, e_id, curriculum,type,description, img_path,status,created,updated) VALUES (?,?,?,?,?,?,?,?,? )";
					db.execute(sql_query, entry.id, entry.e_id,  entry.curriculum,entry.type ,entry.description ,entry.img_path,entry.status,entry.created,entry.updated);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET e_id=?,curriculum=?,type=?,description=?, status=?,img_path=?,updated=? WHERE id=?";
					db.execute(sql_query, entry.e_id,entry.curriculum,entry.type,entry.description, entry.status,entry.img_path,entry.updated, entry.id);
			 	});
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
		}); 
					    
		return Collection;
	}
};