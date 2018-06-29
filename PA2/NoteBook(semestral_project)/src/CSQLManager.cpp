
#include "CSQLManager.h"

const string htmlBeg = "<!DOCTYPE html>\n<html>\n<head>\n<title>\n</title>\n<link rel=\"stylesheet\" type=\"text/css\" href=\"styles.css\">\n</head>\n<body>\n<div class=\"wrapper\">";
const string htmlEnd = "</div>\n</body>\n</html>";

//---------------------------------------------------------------------------------------

bool ExtraWhiteSpaces(const char & first, const char & second){
    return ((first == second) && (second == ' '));
}
//---------------------------------------------------------------------------------------

void removeExtraWhiteSpaces(string & name){
    auto changedString = unique(name.begin(), name.end(), ExtraWhiteSpaces);
    name.erase(changedString, name.end());
    name.erase(name.find_last_not_of(" ")+1);
}
//---------------------------------------------------------------------------------------
CSQLManager::CSQLManager(CDatabase * db): m_localStorageDB(), m_idFastSearching(){
    m_dbMan = db;
    
    sqlite3_stmt *statement1 = nullptr;
    sqlite3_stmt *statement2 = nullptr;

    string queryNote = "select * from NOTE";
 
    int idNote, priceNote;
    string titleNote, typeNote, contentNote;
    // Select all notes from external DB:
    if ( sqlite3_prepare(db->getConnection(), queryNote.c_str(), -1, &statement1, 0 ) == SQLITE_OK )
    {
        int res1 = 0;
        
        
        while ( 1 )
        {
            res1 = sqlite3_step(statement1);
            
            if ( res1 == SQLITE_ROW )
            {
                // Read all columns from from one raw
                idNote = atoi((char*)sqlite3_column_text(statement1, 0));
                titleNote = (char*)sqlite3_column_text(statement1, 1);
                typeNote  = (char*)sqlite3_column_text(statement1, 2);
                contentNote = (char*)sqlite3_column_text(statement1, 3);
                
                CNote * tmpNote = nullptr;
                
                if(typeNote == "Text_Note")
                    tmpNote = new CNoteText(titleNote, typeNote, contentNote, "PlainText", 0);
                if(typeNote == "Task_List"){
                    tmpNote = new CNoteTaskList(titleNote, typeNote, contentNote,  "PlainText", 0);
                }
                if(typeNote == "Shop_List"){
                    priceNote = atoi((char*)sqlite3_column_text(statement1, 4));
                    tmpNote = new CNoteShopList(titleNote, typeNote, contentNote, "PlainText", priceNote);
                }
                
                // Select all tags that belongs to previous read note
                set<string> tags;
                string queryTag = "select NAME from TAG where ID IN (select TAG_ID from TAG_NOTE WHERE NOTE_ID = " + to_string(idNote) + ");";
                if ( sqlite3_prepare(db->getConnection(), queryTag.c_str(), -1, &statement2, 0 ) == SQLITE_OK ){
                    int res2 = 0;
                    while(1){
                        res2 = sqlite3_step(statement2);
                        if ( res2 == SQLITE_ROW ){
                            tags.insert((char*)sqlite3_column_text(statement2, 0));
                        }

                        if ( res2 == SQLITE_DONE || res2==SQLITE_ERROR ){
                                break;
                        }

                    }
                    m_localStorageDB.insert({tags, tmpNote});
                    m_idFastSearching.push_back({idNote, tmpNote});

                }
                sqlite3_finalize(statement2);
                

            }
            if ( res1 == SQLITE_DONE || res1 ==SQLITE_ERROR)
            {
                break;
            }
        }
    }
    sqlite3_finalize(statement1);
}

//---------------------------------------------------------------------------------------
CSQLManager::~CSQLManager(){
    for(auto & i: m_localStorageDB){
        delete i.second;
    }
}
//---------------------------------------------------------------------------------------
void CSQLManager::addNote(CNote & note, set<string> & tags){
    m_localStorageDB.insert({tags, &note});
    int id = m_dbMan->insertNote(note.getTitle(), note.getType(), note.getContent(), note.getPrice(), tags);
    m_idFastSearching.push_back({id, &note});
}
//---------------------------------------------------------------------------------------

void CSQLManager::getAllNotes(vector <CNote*> & resultList)const{
    for(auto & i: m_localStorageDB){
        resultList.push_back(i.second);
    }
}

//---------------------------------------------------------------------------------------
void CSQLManager::searchInLocalDB(set<string> & patterns,  vector <CNote*> & resultList)const{
        for(auto & pattern: patterns){
            for(auto & pair: m_localStorageDB){
                for(auto & tag: pair.first){
                    if(pattern == tag)
                        resultList.push_back(pair.second);
                }
            }
        }
    
}
//---------------------------------------------------------------------------------------
void CSQLManager::searchInLocalDB(string & subText,  vector <CNote*> & resultList, int & criterion)const{
    string tmp;
    // Fill result list
    // By text criterion
    if(criterion == 9){
        for(auto & i : m_localStorageDB){
            tmp = i.second->getContent();
            transform(tmp.begin(), tmp.end(), tmp.begin(), ::tolower);
            removeExtraWhiteSpaces(tmp);
            size_t found = tmp.find(subText);
            if (found!= string::npos){
                resultList.push_back(i.second);
            }
        }
    }
    else{  // By name criterion
        for(auto & i : m_localStorageDB){
            tmp = i.second->getTitle();
            transform(tmp.begin(), tmp.end(), tmp.begin(), ::tolower);
            removeExtraWhiteSpaces(tmp);
            size_t found = tmp.find(subText);
            if(found!= string::npos)
                resultList.push_back(i.second);
        }
    }
}
//---------------------------------------------------------------------------------------
int CSQLManager::getIdNoteDB(const CNote & pattern)const{
    for(auto & i: m_idFastSearching){
        if(i.second->getType() == pattern.getType()){
            if(i.second->getTitle() == pattern.getTitle() && i.second->getContent() == pattern.getContent()
               && i.second->getPrice() == pattern.getPrice())
                return i.first;
        }
    }
    return -1;
}

//---------------------------------------------------------------------------------------

string quotesqlMan( const string& s ) {
    return string("'") + s + string("'");
}
//---------------------------------------------------------------------------------------
void CSQLManager::updateInfoDB(int idNote, set<string> & tagsToAdd, const CNote & updatedNote) const{
    if(idNote == -1)
        return;
    sqlite3_stmt *statement = nullptr;
    string queryUpdateNote;
    string queryAddTags;
    string tagConcatenation;
    
    int idTag;
    
    // Update NOTE table
    if(updatedNote.getType() == "Shop_List"){
        queryUpdateNote = "UPDATE NOTE SET TITLE = " + quotesqlMan(updatedNote.getTitle()) + ", CONTENT = " + quotesqlMan(updatedNote.getContent()) + ", PRICE = " + quotesqlMan(to_string(updatedNote.getPrice())) +  " where ID = " + to_string(idNote) + ";";
    }
    else
        queryUpdateNote = "UPDATE NOTE SET TITLE = " + quotesqlMan(updatedNote.getTitle()) + ", CONTENT = " + quotesqlMan(updatedNote.getContent()) + " where ID = " + to_string(idNote) + ";";
    
    //preparing the condition
    sqlite3_prepare(m_dbMan->getConnection(), queryUpdateNote.c_str(), -1, &statement, 0 );
    sqlite3_step( statement );//executing the statement
    sqlite3_finalize(statement);
        
    for(auto & tag: tagsToAdd){
        // Update TAG table
        queryAddTags = "INSERT INTO TAG ( NAME) "\
        "VALUES (" + quotesqlMan(tag) + ");";
        sqlite3_prepare( m_dbMan->getConnection(), queryAddTags.c_str(), -1, &statement, NULL );
        sqlite3_step( statement );//executing the statement
        sqlite3_finalize(statement);
        
        idTag = (int)sqlite3_last_insert_rowid(m_dbMan->getConnection());
        // Update TAG_NOTE join table
        tagConcatenation = "INSERT INTO TAG_NOTE ( TAG_ID, NOTE_ID) "\
        "VALUES (" + quotesqlMan(to_string(idTag)) + "," + quotesqlMan(to_string(idNote)) + ");";
        sqlite3_prepare( m_dbMan->getConnection(), tagConcatenation.c_str(), -1, &statement, NULL );
        sqlite3_step( statement );//executing the statement
        sqlite3_reset(statement);
    }
    if(tagsToAdd.size()) sqlite3_finalize(statement);
}
//---------------------------------------------------------------------------------------
void CSQLManager::exportSearchingResultHTML( vector<CNote *>& resultSet, const string& fileName ) const{
    if(resultSet.empty())
        return;
    
    vector<int> idNotesToExport;
    for(auto & i: resultSet){
        idNotesToExport.push_back(getIdNoteDB(*i));
    }
    int idNote, res;
    bool orderInp = false;
    sqlite3_stmt * statement = nullptr;
    
    ofstream noteHTML;
    noteHTML.open("./examples/" + fileName + ".html", ios_base::out);
    
    noteHTML << htmlBeg;
    
    for(auto & note : resultSet){
        idNote = getIdNoteDB(*note);
        
        // Based on derived subclass of CNote, ostream will be filled with content of note formatted to html.
        note->prepareContentHTML(noteHTML);
        
        noteHTML << "<p>\n<STRONG><u>Tags:</u></STRONG> <span style=\"font-family: monospace\"> ";
        string queryTag = "select NAME from TAG where ID IN (select TAG_ID from TAG_NOTE WHERE NOTE_ID = " + to_string(idNote) + ");";

        if ( sqlite3_prepare(m_dbMan->getConnection(), queryTag.c_str(), -1, &statement, 0 ) == SQLITE_OK ){
            while(1){
                res = sqlite3_step(statement);
                if ( res == SQLITE_ROW ){
                    if(orderInp)
                        noteHTML << ", " <<   ((char*)sqlite3_column_text(statement, 0));
                    else{
                        noteHTML << ((char*)sqlite3_column_text(statement, 0));
                        orderInp = true;
                    }
                }
                
                if ( res == SQLITE_DONE || res == SQLITE_ERROR ){
                    break;
                }
                
            }
            sqlite3_finalize(statement);
            orderInp = false;
        }
        
        noteHTML << "</span>\n</p>\n</div>";
        
        noteHTML << "<div class=\"horizontal-line\"></div>\n";

    }
    noteHTML << htmlEnd;
    noteHTML.close();
}

//---------------------------------------------------------------------------------------
void CSQLManager::exportSearchingResultCSV(vector<CNote *> & resultSet, const string & fileName) const{
    if(resultSet.empty())
        return;
    
    vector<int> idNotesToExport;
    for(auto & i: resultSet){
        idNotesToExport.push_back(getIdNoteDB(*i));
    }
    
    ofstream noteCSV;
    noteCSV.open("./examples/" + fileName + ".csv", ios_base::out);
    noteCSV << "ID,TITLE,TYPE,CONTENT,PRICE,TAGS\n";
    
    string typeNote;
    int curNoteId;
    string conditionSql = "SELECT * FROM NOTE WHERE (ID = ";

    for(int i = 0; i < (int)idNotesToExport.size(); i++){
        if(i > 0)
            conditionSql+= " OR ID = ";
        conditionSql+= quotesqlMan(to_string(idNotesToExport[i]));
    }
    conditionSql+=");";
    sqlite3_stmt *statement = nullptr;
    sqlite3_stmt *statement2 = nullptr;

    if ( sqlite3_prepare(m_dbMan->getConnection(), conditionSql.c_str(), -1, &statement, 0 ) == SQLITE_OK ){
        int res1 = 0;
        
        while(1){
            res1 = sqlite3_step(statement);

            if ( res1 == SQLITE_ROW )
            {
                curNoteId = atoi((char*)sqlite3_column_text(statement, 0));
                
                noteCSV << to_string(curNoteId) << ",\"";   // ID
                noteCSV << string((char*)sqlite3_column_text(statement, 1)) << "\",";  // TITLE
                typeNote = string((char*)sqlite3_column_text(statement, 2));
                noteCSV << typeNote << ",\"";    // TYPE
                noteCSV << string((char*)sqlite3_column_text(statement, 3)) << "\",";    // CONTENT
                if(typeNote == "Shop_List"){
                    noteCSV << string((char*)sqlite3_column_text(statement, 4));    // PRICE
                }
                noteCSV << ",";
                // PLACE FOR TAGS:
                
                vector<string> tags;
                
                string queryTag = "select NAME from TAG where ID IN (select TAG_ID from TAG_NOTE WHERE NOTE_ID = " + to_string(curNoteId) + ");";
                if ( sqlite3_prepare(m_dbMan->getConnection(), queryTag.c_str(), -1, &statement2, 0 ) == SQLITE_OK ){
                    int res2 = 0;
                    while(1){
                        res2 = sqlite3_step(statement2);
                        if ( res2 == SQLITE_ROW ){
                            tags.push_back((char*)sqlite3_column_text(statement2, 0));
                         }
                        
                        if ( res2 == SQLITE_DONE || res2==SQLITE_ERROR ){
                            break;
                        }
                        
                    }
                    
                }
                sqlite3_finalize(statement2);
                
                if(!tags.empty()){
                   string tagColm = "\"";
                    for(int i = 0; i < (int)tags.size(); i++){
                        if(i != 0)
                            tagColm += ",";
                        tagColm += tags[i];
                    }
                    tagColm += "\"";
                    noteCSV << tagColm;
                }
                
                noteCSV << "\n";
                
            }
            if ( res1 == SQLITE_DONE || res1 ==SQLITE_ERROR)
            {
                break;
            }
            
        }
    }
    sqlite3_finalize(statement);

    noteCSV.close();
    
}
//---------------------------------------------------------------------------------------
void CSQLManager::addingTagsToExistedNote(set<string> & tags, CNote & pattern){
    for(auto i = m_localStorageDB.begin(); i != m_localStorageDB.end(); i++){
        if(i->second->getType() == pattern.getType()){
            if(i->second->getTitle() == pattern.getTitle() && i->second->getContent() == pattern.getContent()
               && i->second->getPrice() == pattern.getPrice()){
                set<string> tagsStor = i->first;
                tagsStor.insert(tags.begin(), tags.end());
                m_localStorageDB.erase(i);
                m_localStorageDB.insert({tagsStor, &pattern});
                break;
            }
            
        }
    }
}

//---------------------------------------------------------------------------------------
bool checkInput(string title, string content , string type, string id){
    
    title.erase(remove(title.begin(), title.end(), ' '), title.end());
    content.erase(remove(content.begin(), content.end(), ' '), content.end());
    type.erase(remove(type.begin(), type.end(), ' '), type.end());
    id.erase(remove(id.begin(), id.end(), ' '), id.end());

    if(title.empty() || content.empty() || type.empty() || id.empty())
        return false;
    return true;
}
//---------------------------------------------------------------------------------------
void getTags(string & pattern, set<string> & storage)
{
    pattern.erase(std::remove_if(pattern.begin(), pattern.end(), [](char c)
                                 { return c=='.'|| c=='!'; }), pattern.end());
    std::replace( pattern.begin(), pattern.end(), ',', ' ');
    std::transform(pattern.begin(), pattern.end(), pattern.begin(), ::tolower);
    
    string   whiteSpace = " ";
    string   symDelim = ",";
    string   tmp;
    
    uint64_t  stPos      = 0; // Where to start
    uint64_t lsPos      = pattern.find_first_of(whiteSpace); // Find the first space
    
    while (true)
    {
        if(lsPos == string::npos){
            // push the last one word
            tmp = pattern.substr(stPos);
            tmp.erase(remove(tmp.begin(), tmp.end(), ' '), tmp.end());
            if(!tmp.empty())
                storage.insert(tmp);
            return;
        }
        
        // one word we can cut
        if (lsPos > stPos)
        {
            //push this word to map
            tmp = pattern.substr(stPos, lsPos - stPos);
            tmp.erase(remove(tmp.begin(), tmp.end(), ' '), tmp.end());
            if(!tmp.empty())
                storage.insert(tmp);
        }
        
        // move start to next position
        lsPos++;
        stPos = lsPos;
        
        //find next one whitespace
        lsPos = pattern.find_first_of(whiteSpace, lsPos);
    }
}
//---------------------------------------------------------------------------------------
CNote * createObj(const string & title, const string & type, const string & content, string & price){
    if(type == "Text_Note")
        return (new CNoteText(title, type, content, "PlainText", 0));
    if(type == "Task_List")
        return (new CNoteTaskList(title, type, content, "PlainText", 0));
    
    price.erase(remove(price.begin(), price.end(), ' '), price.end());
    price.erase(remove(price.begin(), price.end(), '\n'), price.end());
    int priceValue = stoi(price);
    
    return (new CNoteShopList(title, type, content, "PlainText", priceValue));
}
//---------------------------------------------------------------------------------------
void CSQLManager::importNotesToDB(vector <CNote*> & curSessionPrepared, const string & path){

    string trashInput;
    
    ifstream file;
    ofstream output;
    size_t index;
    
    file.open(path);
    
    if(!file.is_open())
        throw Error( "Cannot open file '" + path);

    string ID,TITLE,TYPE,CONTENT,PRICE,TAGS;
    int iteration = 0;
    while(file.good())
    {
        
        if(iteration == 0){
            getline(file, ID, '\n');
            iteration++;
            continue;
        }

        getline(file, ID, ',');
        getline(file, TITLE, ',') ;
        getline(file, TYPE, ',') ;
        getline(file, trashInput, '"') ;
        getline(file, CONTENT, '"') ;
        getline(file, trashInput, ',') ;
        getline(file, PRICE, ',') ;
        getline(file, TAGS, '\n') ;
        
        if(!checkInput(TITLE, CONTENT, TYPE, ID))
            break;
        index = ID.find_first_of("\"");
        ID.erase(0, index);
        
        index = TITLE.find_first_of("\"");
        TITLE.erase(0, index + 1);
        index = TITLE.find_last_of("\"");
        TITLE.erase(index);

        index = TAGS.find_first_of("\"");
        TAGS.erase(0,index + 1);
        index = TAGS.find_last_of("\"");
        TAGS.erase(index);
        
        // Create CNote
        CNote * note = nullptr;
        set<string> tagStorage;
        getTags(TAGS, tagStorage);
        
        note = createObj(TITLE, TYPE, CONTENT, PRICE);
        
        // Add note to DB:
        addNote(*note, tagStorage);
        
        // Prepare storage of added note for current session (to print):
        curSessionPrepared.push_back(note);
        
    }
    file.close();
}
//---------------------------------------------------------------------------------------
void CSQLManager::delNoteFromDB(const CNote & noteToDel){
    // ID for searching in DB for note to delete
    int delId = getIdNoteDB(noteToDel);
    for(auto itToDelF = m_localStorageDB.begin(); itToDelF != m_localStorageDB.end(); itToDelF++){
        // Equal adresses:
        if(itToDelF->second == & noteToDel){
            m_localStorageDB.erase(itToDelF);
            break;
        }
    }
    for(auto itToDelS = m_idFastSearching.begin(); itToDelS != m_idFastSearching.end(); itToDelS++){
        // Equal adresses:
        if(itToDelS->second == &noteToDel){
            m_idFastSearching.erase(itToDelS);
            break;
        }
    }
    
    // Delete from db sqlite file/external DB:
    m_dbMan->delUsingID(delId);
}
//---------------------------------------------------------------------------------------


