#include "CNoteText.h"

//---------------------------------------------------------------------------------------
CNoteText::CNoteText(const string & title, const string & type, const string & content, const string  & curForm, const int & price):
CNote(title, type, content, curForm, price){}

//---------------------------------------------------------------------------------------

CNoteText::~CNoteText(){}
//---------------------------------------------------------------------------------------

void CNoteText::prepareContent(vector<string> & content) const{
    string dataToPrepate = getContent();
    size_t index;
    
    while((index=dataToPrepate.find_first_of("\n"))!=string::npos){
        content.push_back(dataToPrepate.substr(0, index - 1));
        dataToPrepate.erase(0, index + 1);
    }
}

//---------------------------------------------------------------------------------------
void CNoteText::prepareContentHTML( ofstream& htmlFile ) const{
    string toEdit;
    
    htmlFile << "<div class = \"" << getType() << "\">";
    toEdit = getTitle();
    
    eraseTrailingSpaces(toEdit);
    
    htmlFile << "<h1>" << toEdit << "</h1>\n";
    htmlFile << "<h2>" << getType() << "</h2>\n";
    
    vector <string> contentToEdit;
    prepareContent(contentToEdit);
    for(auto & line : contentToEdit){
        eraseTrailingSpaces(line);
        if(!line.empty())
            htmlFile << "<pre>" << line << "</pre>\n";
    }

}
//---------------------------------------------------------------------------------------

