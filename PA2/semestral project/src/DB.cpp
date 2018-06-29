#include "DB.h"

//---------------------------------------------------------------------------------------
/*! \fn int callback(void *NotUsed, int argc, char **argv, char **azColName)
 \brief Used to traverse SELECT statements with multiple records.
 \param[in] NotUsed in this implementation
 \param[in] argc The number of columns in the result set
 \param[in] argv The row's data
 \param[in] azColName The column names
 */
static int callback(void *NotUsed, int argc, char **argv, char **azColName) {
    int i;
    for(i = 0; i<argc; i++) {
        printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
    }
    printf("\n");
    return 0;
}
//---------------------------------------------------------------------------------------
/*! \fn string quotesql( const string& s )
 \brief Create sql string from c++ string.
 */
string quotesql( const string& s ) {
    return string("'") + s + string("'");
}
//---------------------------------------------------------------------------------------
sqlite3 * CDatabase::getConnection() const{
    return db;
}
//---------------------------------------------------------------------------------------

CDatabase::CDatabase() : zErrMsg(0){
   rc = sqlite3_open("./examples/notebook.db", &db);
    
    if( rc != SQLITE_OK ) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
    } else {
        fprintf(stderr, "Opened database successfully\n");
    }
}
//---------------------------------------------------------------------------------------

CDatabase::~CDatabase(){
    sqlite3_db_release_memory(db);
    sqlite3_close(db);
}
//---------------------------------------------------------------------------------------

void CDatabase::createDefaultTables( void ){
    sqlstatement = "CREATE TABLE NOTE( " \
    "ID  INTEGER PRIMARY KEY  AUTOINCREMENT, " \
    "TITLE TEXT NOT NULL, " \
    "TYPE TEXT NOT NULL , " \
    "CONTENT TEXT NOT NULL, "\
    "PRICE INTEGER );"\
    
    "CREATE TABLE TAG(" \
    "ID INTEGER PRIMARY KEY AUTOINCREMENT, "\
    "NAME TEXT NOT NULL) ;" \
    
    "CREATE TABLE TAG_NOTE ( "\
    "TAG_ID   INTEGER NOT NULL, "\
    "NOTE_ID INTEGER NOT NULL, " \
    "FOREIGN KEY (TAG_ID) REFERENCES TAG(ID), "\
    "FOREIGN KEY (NOTE_ID) REFERENCES NOTE(ID)); ";
    
    /* Execute SQL statement */
    
    rc = sqlite3_exec(db, sqlstatement.c_str(), callback, 0, &zErrMsg);
    if( rc != SQLITE_OK ){
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Table created successfully\n");
    }
}
//---------------------------------------------------------------------------------------
int CDatabase::insertNote(const string & title, const string & type, const string & content, const int & price, set<string> & tags){

    if(type == "Shop_List"){
        sqlstatement = "INSERT INTO NOTE ( TITLE, TYPE, CONTENT, PRICE) "\
        "VALUES (" + quotesql(title) + "," + quotesql(type) + "," + quotesql(content) + "," + quotesql(to_string(price)) + ");";
    }
    else
        sqlstatement = "INSERT INTO NOTE ( TITLE, TYPE, CONTENT) "\
        "VALUES (" + quotesql(title) + "," + quotesql(type) + "," + quotesql(content) + ");";
    
    //preparing the statement
    sqlite3_prepare( db, sqlstatement.c_str(), -1, &stmt, NULL );
    sqlite3_step( stmt );//executing the statement
    sqlite3_finalize(stmt);

    int idNote = (int)sqlite3_last_insert_rowid(db);
    int idTag;
    
    for(auto & tag: tags){
        sqlstatement = "INSERT INTO TAG ( NAME) "\
        "VALUES (" + quotesql(tag) + ");";
        sqlite3_prepare( db, sqlstatement.c_str(), -1, &stmt, NULL );
        sqlite3_step( stmt );//executing the statement
        sqlite3_finalize(stmt);
        
        idTag = (int)sqlite3_last_insert_rowid(db);
        sqlstatement = "INSERT INTO TAG_NOTE ( TAG_ID, NOTE_ID) "\
        "VALUES (" + quotesql(std::to_string(idTag)) + "," + quotesql(to_string(idNote)) + ");";
        sqlite3_prepare( db, sqlstatement.c_str(), -1, &stmt, NULL );
        sqlite3_step( stmt );//executing the statement
        sqlite3_finalize(stmt);
    }
    return idNote;
}
//---------------------------------------------------------------------------------------
void CDatabase::delUsingID(const int & indexToDel){
    int res = 0;
    
    vector<string> tagsId;
    sqlstatement = "SELECT TAG_ID FROM TAG_NOTE WHERE NOTE_ID = " + to_string(indexToDel) + ";";
    sqlite3_prepare( db, sqlstatement.c_str(), -1, &stmt, NULL );
    
    
    while ( 1 )
    {
        res = sqlite3_step(stmt);
        
        if ( res == SQLITE_ROW )
        {
            tagsId.push_back((char*)sqlite3_column_text(stmt, 0));
        }
        if ( res == SQLITE_DONE || res ==SQLITE_ERROR)
        {
            break;
        }
    }

    sqlite3_finalize(stmt);
    
    sqlstatement = "DELETE FROM TAG_NOTE WHERE NOTE_ID = " + to_string(indexToDel) + ";";
    sqlite3_prepare( db, sqlstatement.c_str(), -1, &stmt, NULL );
    sqlite3_step( stmt );//executing the statement
    sqlite3_finalize(stmt);
    
    sqlstatement = "DELETE FROM NOTE WHERE ID = " + to_string(indexToDel) + ";";
    sqlite3_prepare( db, sqlstatement.c_str(), -1, &stmt, NULL );
    sqlite3_step( stmt );//executing the statement
    sqlite3_finalize(stmt);
    
    
    for(auto & idTag: tagsId){
        sqlstatement = "DELETE FROM TAG WHERE ID = " + idTag + ";";
        sqlite3_prepare( db, sqlstatement.c_str(), -1, &stmt, NULL );
        sqlite3_step( stmt );//executing the statement
        sqlite3_finalize(stmt);
    }
}
//---------------------------------------------------------------------------------------
