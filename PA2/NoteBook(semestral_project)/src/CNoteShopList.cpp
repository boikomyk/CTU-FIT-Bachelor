#include "CNoteShopList.h"

//---------------------------------------------------------------------------------------
CNoteShopList::CNoteShopList(const string & title, const string & type, const string & content, const string  & curForm, const int & price):
CNote(title, type, content, curForm, price){}
//---------------------------------------------------------------------------------------

CNoteShopList::~CNoteShopList(){}

//---------------------------------------------------------------------------------------

void CNoteShopList::prepareContent(vector<string> & content) const{
    string dataToPrepate = getContent();
    string tmp;
    size_t index;
    size_t indexOfDelim;
    
    while((index=dataToPrepate.find_first_of("\n"))!=string::npos){
        
        tmp = dataToPrepate.substr(0, index + 1);

        indexOfDelim = tmp.find_first_of("|");
        content.push_back(tmp.substr(0,indexOfDelim - 1));
        
        content.push_back(tmp.substr(indexOfDelim + 1, tmp.length()));
        dataToPrepate.erase(0, tmp.length());
    }
    
}
//---------------------------------------------------------------------------------------
void CNoteShopList::prepareContentHTML( ofstream& htmlFile ) const{
    string toEditF, toEditS;
    
    htmlFile << "<div class = \"" << getType() << "\">";
    toEditF = getTitle();
    
    eraseTrailingSpaces(toEditF);
    
    htmlFile << "<h1>" << toEditF << "</h1>\n";
    htmlFile << "<h2>" << getType() << "</h2>\n";

    htmlFile << "<table>\n<tr>\n<th>Item</th>\n<th>Price</th>\n<th>Full Price</th>\n</tr>";
    vector<string> contentToEdit;
    prepareContent(contentToEdit);
    
    int rowspan = (int)contentToEdit.size()/2;
    
    for(int i = 0; i < (int)contentToEdit.size()/2; i++){
        toEditF = contentToEdit[2*i];
        eraseTrailingSpaces(toEditF);
        toEditS = contentToEdit[2*i + 1];
        eraseTrailingSpaces(toEditS);
        if(!toEditF.empty() && !toEditS.empty()){
            htmlFile << "<tr>\n";
            htmlFile << "<td>" << toEditF.substr(2,(int)toEditF.length()) << "</td>\n";
            htmlFile << "<td>" << toEditS << "</td>\n";
            if(i == 0)
                htmlFile << "<td rowspan=\"" << rowspan << "\">" <<  getPrice() << "</td>\n";
            htmlFile << "</tr>\n";

        }
    }
    htmlFile << "</table>";
  
}
//---------------------------------------------------------------------------------------

