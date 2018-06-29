#include "CDirectory.h"

static string keywords[2] = {".csv",".html"};

//---------------------------------------------------------------------------------------

CDirectory::~CDirectory( void ){}
//---------------------------------------------------------------------------------------
CDirectory::CDirectory( const std::string& name, const std::string& path ): m_name(name), m_path(path), m_FileList(){}
//---------------------------------------------------------------------------------------
void CDirectory::readDirectory(void){
    m_FileList.clear();
    DIR *d = nullptr;
    struct dirent *dir;
    d = opendir((m_path + m_name).c_str());
    if (d) {
        while ((dir = readdir(d)) != NULL) {
            m_FileList.push_back(dir->d_name);
        }
        closedir(d);
    }
    else
        throw Error( "Cannot open folder '" + (m_path + m_name));
}
//---------------------------------------------------------------------------------------
vector<string> & CDirectory::getFileList(void){
    return m_FileList;
}
//---------------------------------------------------------------------------------------
string CDirectory::getRelativePath(void) const{
    return (m_path + m_name + "/");
}
//---------------------------------------------------------------------------------------
bool CDirectory::checkFormatImport(const int index) const{
    if(m_FileList.empty() || index >= (int)m_FileList.size())
        return false;
    
    size_t found;
    
    if((found = m_FileList[index].find(".csv")) != std::string::npos && found != 0 && (int)m_FileList[index].length() > 4){
        struct stat st;
        int res = stat((m_path + m_name +  "/" + m_FileList[index]).c_str(), &st);
        if(res == 0)
            return true;
        return false;
    }

    return false;
}
//---------------------------------------------------------------------------------------
bool CDirectory::checkFormatShow(const int index) const{
    if(m_FileList.empty() || index >= (int)m_FileList.size())
        return false;
    return any_of(std::begin(keywords), std::end(keywords),
                  [&](const std::string& str){return m_FileList[index].find(str) != std::string::npos;});
}
//---------------------------------------------------------------------------------------
string CDirectory::getCSVContentShow(const int index){
    ifstream file(m_path + m_name +  "/" + m_FileList[index]);
    // if file operation failed
    if (file.fail())
    {
        throw Error( "Cannot read file '" + m_path + m_name +  "/" + m_FileList[index]);
    }
    stringstream strStream;
    string content;
    strStream << file.rdbuf();
    content = strStream.str();
    file.close();
    strStream.clear();
    return content;
}
//---------------------------------------------------------------------------------------
string CDirectory::returnPathToFile(const int index) const{
    return (m_path + m_name +  "/" + m_FileList[index]);
}
//---------------------------------------------------------------------------------------
void CDirectory::delCSV(const string & fileName){
    DIR *theFolder = opendir((m_path + m_name).c_str());
    if(theFolder){
        remove((m_path + m_name + "/" + fileName).c_str());
        closedir(theFolder);
    }
    else
        throw Error( "Cannot delete CSV file '" + (m_path + m_name + "/" + fileName));
}
//---------------------------------------------------------------------------------------
void CDirectory::showHTML( const int index ) const{
    string command;
    #if (defined (LINUX) || defined (__linux__))
        command = "xdg-open ";
    #elif (defined(__APPLE__) || defined(TARGET_OS_MAC))
        command = "open ";
    #endif
    int mess = system((command + getRelativePath() + m_FileList[index] + " " + "> /dev/null 2>&1 &").c_str());
    // If executed fails
    if(mess < 0)
        throw Error( "Cannot open HTML file '" + (getRelativePath() + m_FileList[index]));
}
//---------------------------------------------------------------------------------------
string CDirectory::fileFormat(const int index) const{
    size_t found;
    if((found = m_FileList[index].find(".csv")) != std::string::npos && found != 0)
        return "CSV";
    if((found = m_FileList[index].find(".html")) != std::string::npos && found != 0)
        return "HTML";
    return "UNDEF";
}
//---------------------------------------------------------------------------------------



