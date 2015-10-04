exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY", 
		    "ec_id": "TEXT", 
		    "subject": "TEXT",
		    "remark": "TEXT", 
		    'deadline': "TEXT", 
		    'published_by': "TEXT", 
		    'img_path': "TEXT", 
		    'status': "INTEGER",
		    "created"  : "TEXT",
		    "updated"  : "TEXT"
		},
	  
		adapter: {
			type: "sql",
			collection_name: "homework",
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
			getHomeworkById : function(id){
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
					    ec_id: res.fieldByName('ec_id'),
					    subject: res.fieldByName('subject'),
					    remark: res.fieldByName('remark'),
					    deadline: res.fieldByName('deadline'),
					    published_by: res.fieldByName('published_by'), 
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'), 
					    updated: res.fieldByName('updated')  
					};
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
		    getHomeworkByTeacher :  function(u_id,searchKey){
				var collection = this;
				var search = ""; 
				if(searchKey != ""){
					search = " AND (subject LIKE'%"+searchKey +"%' OR remark LIKE'%"+searchKey +"%') "; 
				}
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE published_by='"+ u_id+ "' "+search+"  ORDER BY created DESC " ;
 			 
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
					    ec_id: res.fieldByName('ec_id'),
					    subject: res.fieldByName('subject'),
					    remark: res.fieldByName('remark'),
					    deadline: res.fieldByName('deadline'),
					    published_by: res.fieldByName('published_by'), 
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
            getHomeworkByClass :  function(ec_id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE ec_id='"+ ec_id+ "'  ORDER BY created DESC " ;
 
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
					    ec_id: res.fieldByName('ec_id'),
					    subject: res.fieldByName('subject'),
					    remark: res.fieldByName('remark'),
					    deadline: res.fieldByName('deadline'),
					    published_by: res.fieldByName('published_by'), 
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
            saveArray : function(arr){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
        		arr.forEach(function(entry) {
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, ec_id, subject,remark, deadline, published_by,status,created,updated) VALUES (?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.ec_id,  entry.subject,entry.remark,entry.deadline,entry.published_by ,entry.status,entry.created,entry.updated);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET subject=?,remark=?,deadline=?,status=?,updated=? WHERE id=?";
					db.execute(sql_query, entry.subject,entry.remark,entry.deadline,  entry.status ,entry.updated, entry.id);
			 		
			 	});
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
		}); 
		return Collection;
	}
};