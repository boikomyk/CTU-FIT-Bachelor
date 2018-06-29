#include "CSearchRequest.h"

//---------------------------------------------------------------------------------------

CSearchRequest::CSearchRequest(): m_patternToSearch(), m_subText(""), m_searchResult(),  m_curRequest(nullptr){}

//---------------------------------------------------------------------------------------

CSearchRequest::~CSearchRequest(){}

//---------------------------------------------------------------------------------------
bool MutipleWhiteSpaces(const char & first, const char & second){
    return ((first == second) && (second == ' '));
}
//---------------------------------------------------------------------------------------
void removeMultipleWhitespaces(string & name){
    auto changedString = unique(name.begin(), name.end(), MutipleWhiteSpaces);
    name.erase(changedString, name.end());
    name.erase(name.find_last_not_of(" ")+1);
}
//---------------------------------------------------------------------------------------
void CSearchRequest::fillSearchPatterns(string & pattern)
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
                m_patternToSearch.insert(tmp);
            return;
        }
        
        // one word we can cut
        if (lsPos > stPos)
        {
            //push this word to map
            tmp = pattern.substr(stPos, lsPos - stPos);
            tmp.erase(remove(tmp.begin(), tmp.end(), ' '), tmp.end());
            if(!tmp.empty())
                m_patternToSearch.insert(tmp);
        }
        
        // move start to next position
        lsPos++;
        stPos = lsPos;
        
        //find next one whitespace
        lsPos = pattern.find_first_of(whiteSpace, lsPos);
    }
}
//---------------------------------------------------------------------------------------
void CSearchRequest::getSubTextPattern(string & subtext){
    string toFormat  = subtext;
    removeMultipleWhitespaces(toFormat);
    std::transform(toFormat.begin(), toFormat.end(), toFormat.begin(), ::tolower);
    m_subText = toFormat;
}
//---------------------------------------------------------------------------------------
void CSearchRequest::prepareResultList(CSQLManager * manager, int & criterion){
    if(criterion == 11){
        manager->getAllNotes(m_searchResult);
        return;
    }
    
    // Nothing to look
    if(m_patternToSearch.empty() && m_subText.empty())
        return;

    if(m_patternToSearch.empty()){        // STORAGE for tags
        manager->searchInLocalDB(m_subText, m_searchResult, criterion);
    }
    else{
        manager->searchInLocalDB(m_patternToSearch, m_searchResult);
    }
}
//---------------------------------------------------------------------------------------
void CSearchRequest::clearCurSession(){
    m_patternToSearch.clear();
    m_subText = "";
    m_searchResult.clear();
    m_curRequest = nullptr;
}
//---------------------------------------------------------------------------------------
vector<CNote*> & CSearchRequest::getResultList(){
    return m_searchResult;
}
//---------------------------------------------------------------------------------------
void CSearchRequest::setCurNoteToShow(CNote & choise){
    m_curRequest = &choise;
}
//---------------------------------------------------------------------------------------
CNote * CSearchRequest::getCurNote() const{
    return m_curRequest;
}
//---------------------------------------------------------------------------------------
bool CSearchRequest::curSessionStatus() const{
    return m_searchResult.empty();
}
//---------------------------------------------------------------------------------------
void CSearchRequest::updateCurSession(vector <CNote*> & update){
    m_searchResult = update;
}
//---------------------------------------------------------------------------------------
void CSearchRequest::deleteNoteInCurSession(const int & index){
    m_searchResult.erase(m_searchResult.begin() + index);
}
//---------------------------------------------------------------------------------------
void CSearchRequest::getListByType(vector <CNote*> & listNotes, const string & type){

    if(type == "All "){
        listNotes =  getResultList();
        return;
    }
    size_t index;
    for(auto & note: m_searchResult){
        if((index = note->getType().find(type)) != string::npos)
            listNotes.push_back(note);
    }
}
//---------------------------------------------------------------------------------------




