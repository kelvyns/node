exports.massiveInsertFormat = function(table, columns, columnsUpdatem, allValues) {
	// table: 'tabla'
	// columns: 'b,c'
	// values :'["(1,2,3)", "(1,2,3)"]'
	var column = columnsUpdatem.split(",");
	var condition = [];
	for (var i = 0; i < column.length; i++) { 
	   condition[i]= column[i] + "= VALUES( " + column[i] + ")";
	   
	}
	var values = allValues.toString();
	var conditions = condition.toString();
	var sql = 'INSERT INTO '+ table + ' ('+ columns.toString() + ') VALUES '+ values +' ON DUPLICATE KEY UPDATE '+ conditions;
	return sql;
}
