exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER", 
		    "name": "TEXT",
		    "education_type": "INTEGER",
		    "level": "INTEGER",
		    "address": "TEXT",
		    "state": "TEXT",
		    "postcode": "TEXT",
		    "longitude": "TEXT",
		    "latitude": "TEXT",
		    "contact_no" : "TEXT",
		    "fax_no": "TEXT", 
		    "email": "TEXT",
		    'website': "TEXT",
		    "img_path" : "TEXT",
		    "school_type" : "TEXT",
		    'status': "INTEGER",
		},
		adapter: {
			type: "sql",
			collection_name: "education",
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
			getSchoolList : function(schStatus, educationType, searchKey){
				var collection = this;
				var arr = []; 
				var lvlpick = Ti.App.Properties.getString('LevelPick');  
				var typepick = Ti.App.Properties.getString('TypePick');  
				var statepick = Ti.App.Properties.getString('StatePick'); 
				
				var sts = "";
				if(schStatus != "all"){
					sts = " AND status="+schStatus;	
				}
				
				var srh = "";
				if(searchKey != ""){
					srh = " AND name LIKE '%"+searchKey+"%' ";
				}
				
				var lvlntype = ""; 
				if(lvlpick == null && typepick == null && statepick == null ){
					if(educationType == "1"){
						lvlntype = " AND level=1 AND school_type=1  ";
					}
					var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE state='wp' "+sts+" AND education_type='"+educationType+"' " +srh + lvlntype ;
					 
				}else{
					var str ="";
					if(lvlpick != null && educationType == "1"){ 
						lvlpick = parseInt(lvlpick) +1;
						str += " AND level='"+lvlpick+"'";
					} 
					if(typepick != null && educationType == "1"){ 
						typepick = parseInt(typepick) +1;
						str += " AND school_type='"+typepick+"'";
					}
					if(statepick != null){ 
						var st;
						if(statepick == "0"){
							st = "wp";
						}
						if(statepick == "1"){
							st = "sl";
						}
						str += " AND state='"+st+"'";
					}
					 
					var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE education_type='"+educationType+"' "+sts+" " + str +srh;
				} 
				 
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                
                
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
						id: res.fieldByName('id'),
						education_type: res.fieldByName('education_type'),
					    name: res.fieldByName('name'),
					    level: res.fieldByName('level'),
					    address: res.fieldByName('address'),
					    state: res.fieldByName('state'),
					    postcode: res.fieldByName('postcode'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    contact_no: res.fieldByName('contact_no'),
					    fax_no: res.fieldByName('fax_no'),
					    email: res.fieldByName('email'),
					    website: res.fieldByName('website'),
					    img_path: res.fieldByName('img_path'),
					    school_type: res.fieldByName('school_type'),
					    status: res.fieldByName('status'),
					};
					res.next();
					count++;
				} 
		 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getSchoolById : function(id){
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
						education_type: res.fieldByName('education_type'),
					    name: res.fieldByName('name'),
					    level: res.fieldByName('level'),
					    address: res.fieldByName('address'),
					    state: res.fieldByName('state'),
					    postcode: res.fieldByName('postcode'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    contact_no: res.fieldByName('contact_no'),
					    fax_no: res.fieldByName('fax_no'),
					    email: res.fieldByName('email'),
					    website: res.fieldByName('website'),
					    img_path: res.fieldByName('img_path'),
					    school_type: res.fieldByName('school_type'),
					    status: res.fieldByName('status'),
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
	                var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, name,education_type, level,address,state,postcode,contact_no,fax_no,email,longitude,latitude,website,img_path,school_type,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.name,entry.education_type, entry.level,entry.address,entry.state ,entry.postcode,entry.contact_no,entry.fax_no,entry.email,entry.longitude,entry.latitude,entry.website,entry.img_path,entry.school_type,entry.status);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET name=?,education_type=?,level=?,address=?,state=?,postcode=?,contact_no=?,fax_no=?,email=?,longitude=?,latitude=?,website=?,img_path=?,school_type=?,status=? WHERE id=?";
					db.execute(sql_query,   entry.name,entry.education_type,entry.level,entry.address,entry.state,entry.postcode,entry.contact_no,entry.fax_no,entry.email,entry.longitude,entry.latitude,entry.website,entry.img_path,entry.school_type,entry.status, entry.id);
				});
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
		});

		return Collection;
	}
};