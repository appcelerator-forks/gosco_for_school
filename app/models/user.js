exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY", 
		    "e_id": "INTEGER", 
		    "fullname": "TEXT", 
		    "username": "TEXT",
		    "mobile": "TEXT",
		    "email": "TEXT",  
		    "position": "TEXT",
		    "role": "TEXT",
		    "status": "TEXT",
		    "created": "TEXT",
		    "updated": "TEXT",
		},
		adapter: {
			type: "sql",
			collection_name: "user",
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
			getUserByEducation : function(e_id, searchKey){
				var collection = this;
				var search = ""; 
				if(searchKey != ""){
					search = " AND (fullname LIKE'%"+searchKey +"%' OR email LIKE'%"+searchKey +"%' OR mobile LIKE'%"+searchKey +"%' OR role LIKE'%"+searchKey +"%' OR position LIKE'%"+searchKey +"%') "; 
				}
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE e_id='"+ e_id+ "' "+search + " ORDER BY fullname" ; 
             
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
					    fullname: res.fieldByName('fullname'),
					    username: res.fieldByName('username'),
					    mobile: res.fieldByName('mobile'),
					    email: res.fieldByName('email'), 
					    role: res.fieldByName('role'), 
					    position: res.fieldByName('position'), 
					    status: res.fieldByName('status'), 
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
			getUserById : function(id){
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
					    fullname: res.fieldByName('fullname'),
					    username: res.fieldByName('username'),
					    mobile: res.fieldByName('mobile'),
					    email: res.fieldByName('email') ,
					    position: res.fieldByName('position') ,
					    role: res.fieldByName('role') ,
					    status: res.fieldByName('status') ,
					    created: res.fieldByName('created') ,
					    updated: res.fieldByName('updated')  
					 
					};
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
                db.execute("BEGIN"); 
        		arr.forEach(function(entry) { 
        			entry.e_id =  entry.e_id || Ti.App.Properties.getString('e_id');
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, e_id,fullname, username,email,mobile,position,role,status, created,updated  ) VALUES (?,?, ?,?,?, ?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.e_id, entry.fullname, entry.username,entry.email,entry.mobile,entry.position, entry.role,entry.status,entry.created,entry.updated);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET fullname=?, e_id=?, email=?,mobile=?, position=?, role=?,status=?,updated=?  WHERE id=?";
					db.execute(sql_query,   entry.fullname, entry.e_id,entry.email,entry.mobile,entry.position, entry.role,entry.status,entry.updated, entry.id);
	 
			    }); 
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
			resetStaff : function(){
				var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name;
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.execute(sql);
                db.close();
                collection.trigger('sync');
			},
		});

		return Collection;
	}
};