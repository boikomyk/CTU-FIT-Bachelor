#include "CNoteTaskList.h"

//---------------------------------------------------------------------------------------
CNoteTaskList::CNoteTaskList(const string & title, const string & type, const string & content, const string  & curForm, const int & price):
CNote(title, type, content, curForm, price){}
//---------------------------------------------------------------------------------------

CNoteTaskList::~CNoteTaskList(){}

//---------------------------------------------------------------------------------------

void CNoteTaskList::prepareContent(vector<string> & content) const{
    string dataToPrepate = getContent();
    size_t index;
    while((index=dataToPrepate.find_first_of("\n"))!=string::npos){
        content.push_back(dataToPrepate.substr(2, index - 1));
        dataToPrepate.erase(0, index + 1);
    }
    
}

//---------------------------------------------------------------------------------------
void CNoteTaskList::prepareContentHTML( ofstream& htmlFile ) const{
    string toEdit;
    
    htmlFile << "<div class = \"" << getType() << "\">";
    toEdit = getTitle();
    
    eraseTrailingSpaces(toEdit);
    
    htmlFile << "<h1>" << toEdit << "</h1>\n";
    htmlFile << "<h2>" << getType() << "</h2>\n";
    
    htmlFile << "<ul style=\"list-style-type:circle\">\n";
    vector <string> contentToEdit;
    prepareContent(contentToEdit);
    
    for(auto & line : contentToEdit){
        eraseTrailingSpaces(line);
        if(!line.empty())
            htmlFile << "<li>" << line << "</li>\n";
    }
    htmlFile << "</ul>\n";
    
}
//---------------------------------------------------------------------------------------
