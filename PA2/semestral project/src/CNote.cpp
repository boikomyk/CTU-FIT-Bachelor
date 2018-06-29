#include "CNote.h"

//---------------------------------------------------------------------------------------
CNote::CNote(const string& title, const string  & type, const string & content, const string  & curForm, const int & price){
    m_title = title;
    m_type = type;
    m_content = content;
    m_curForm = curForm;
    m_price = price;
}
//---------------------------------------------------------------------------------------

CNote::~CNote(){}
//---------------------------------------------------------------------------------------

string CNote::getTitle() const{
    return m_title;
}
//---------------------------------------------------------------------------------------

string CNote::getType() const{
    return m_type;
}
//---------------------------------------------------------------------------------------

string CNote::getContent() const{
    return m_content;
}
//---------------------------------------------------------------------------------------

int CNote::getPrice() const{
    return m_price;
}
//---------------------------------------------------------------------------------------

void CNote::updateInfo(const string& title, const string& content, const string& curForm, const int& price){
    m_title = title;
    m_content = content;
    m_curForm = curForm;
    m_price = price;
}
//---------------------------------------------------------------------------------------
void CNote::eraseTrailingSpaces(string & toEdit){
    toEdit.erase(toEdit.find_last_not_of(" \t\n\r\f\v") + 1);
}
//---------------------------------------------------------------------------------------


