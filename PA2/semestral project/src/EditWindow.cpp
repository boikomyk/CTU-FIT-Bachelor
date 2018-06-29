#include "EditWindow.h"

const string searchResult = "Searching result:";
const string importContent = "Import content:";
const string importResult = "Enter import CSV";
const string openResult = "Enter to open";
const string showCSV = "TAB to show file content";
const string deleteCommand = "BS del,";
const string typeSelect[4] = {"All ", "Text", "Task", "Shop"};

static FIELD*   FILE_NAME_FIELD[2];
static WINDOW*  NB_ASK_WIN;
static FORM*    NB_ASK_FORM;
//---------------------------------------------------------------------------------------
int getType(const string & type){
    if(type == "Text_Note")
        return 12;
    if(type == "Task_List")
        return 13;
    return 14;
}
//---------------------------------------------------------------------------------------
EditWindow::~EditWindow( void )
{
    del_panel(m_Panel);
    delwin(m_Win);
    delwin(m_Notice);
}
//---------------------------------------------------------------------------------------

EditWindow::EditWindow(int h, int w, int x, int y )
:m_SelPos(0), m_Offset(0)
{
    m_Win = newwin( h , w, x, y );
    keypad( m_Win, TRUE );
    m_Panel = new_panel(m_Win);
    m_Notice = newwin( 3, 30,LINES/2 - 1, COLS/2 - 1);
}
//---------------------------------------------------------------------------------------
void EditWindow::initRight( void )
{
    wclear( m_Win );
    box( m_Win, 0, 0 );
    mvwprintw(m_Win,1,3,labelEdit.c_str());
    mvwprintw(m_Win,1,COLS*3/4 - 5  - (int)labelSave.length() ,labelSave.c_str());
    mvwchgat( m_Win, 1, COLS*3/4 - 5  - (int)labelSave.length() , 2, A_NORMAL, 1, NULL );
    mvwhline(m_Win, 2, 1, 0, COLS*3/4 - 4);
}
//---------------------------------------------------------------------------------------
void  EditWindow::printItems(vector <CNote*> & resultList )const
{
    int  width =  COLS*3/4 - 5, menulength = LINES - 8;
    char formatstring[7];
    curs_set(0);
    if ( (int) resultList.size() < menulength )
        menulength = (int)resultList.size();
    sprintf(formatstring,"%%-%ds",width);
    
    //int mvwprintw(WINDOW *win, int y, int x, const char *fmt, ...);
    
    for (int i=0; i < menulength; i++)
    {
        if (i+m_Offset==m_SelPos)
            wattron(m_Win,A_REVERSE);
        mvwprintw(m_Win,3+i,1, formatstring, resultList[i+m_Offset]->getTitle().c_str());
        mvwprintw(m_Win,3+i,COLS*3/4 - 6 - (int)resultList[i+m_Offset]->getType().size(),  resultList[i+m_Offset]->getType().c_str());
        wattroff(m_Win,A_REVERSE);
        wrefresh( m_Win );
    }
}
//---------------------------------------------------------------------------------------
void  EditWindow::printDir(vector <string> & fileList, CDirectory * dir)const{
    int  width =  COLS*3/4 - 5, menulength = LINES - 8;
    char formatstring[7];
    curs_set(0);
    
    if ( (int) fileList.size() < menulength )
        menulength = (int)fileList.size();
    sprintf(formatstring,"%%-%ds",width);
    
    //int mvwprintw(WINDOW *win, int y, int x, const char *fmt, ...);
    
    for (int i=0; i < menulength; i++)
    {
        if (i+m_Offset==m_SelPos)
            wattron(m_Win,A_REVERSE);
        mvwprintw(m_Win,3+i,1, formatstring, fileList[i+m_Offset].c_str());
        mvwprintw(m_Win,3+i,COLS*3/4 - 11,  dir->fileFormat(i).c_str());
        wattroff(m_Win,A_REVERSE);
        wrefresh( m_Win );
    }
}
//---------------------------------------------------------------------------------------
bool EditWindow::checkIfNotEmptyInput(char * buffText, const std::string notice){
    string inputStr = buffText;
    size_t posName = inputStr.find("Name:");
    size_t posTags = inputStr.find("Tags:");

    if( (posName != std::string::npos && posName == 0) || (posTags != std::string::npos && posTags == 0) )
        inputStr = inputStr.substr(5, inputStr.length());
    
    inputStr.erase(remove(inputStr.begin(), inputStr.end(), ' '), inputStr.end());

    if( inputStr.empty() )
    {
        printNotice( "HINT: ", notice);
        getch();
        wclear( m_Notice );
        wrefresh(m_Notice);
        closeInputAndFree();
        return false;
    }
    return true;
}
//---------------------------------------------------------------------------------------

void EditWindow::printNotice ( const std::string & type, const std::string & text)const
{
    wclear( m_Notice );
    box( m_Notice, 0, 0 );
    wrefresh( m_Notice );
    mvwprintw( m_Notice,1, 1,type.c_str());
    mvwprintw( m_Notice,1, (int)type.size() + 2,text.c_str());
    wrefresh( m_Notice );
}

//---------------------------------------------------------------------------------------
void EditWindow::splitStringToWords(string & pattern, set<string> & storage)
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
string EditWindow::getFileName(){
    
    // Inicializace of input field and associated objects:
    FILE_NAME_FIELD[0] = new_field(1, 20, 0, 0, 0, 0);
    set_field_buffer(FILE_NAME_FIELD[0], 0, 0);
    set_field_opts(FILE_NAME_FIELD[0], O_VISIBLE | O_STATIC | O_PUBLIC | O_EDIT | O_ACTIVE | A_UNDERLINE);
    NB_ASK_FORM = new_form(FILE_NAME_FIELD);

    
    set_form_sub(NB_ASK_FORM, derwin(panel_window(m_Panel), 1, 20, LINES - 5, 1));
    set_field_buffer(FILE_NAME_FIELD[0], 0, "File: ");
    
    NB_ASK_WIN  =  panel_window(m_Panel);
    post_form(NB_ASK_FORM);
    
    show_panel(m_Panel);
    update_panels();
    doupdate();
    refresh();
    NB_ASK_FORM->curcol = 6;

    wrefresh(NB_ASK_WIN);
    int key;
    
    // Fill input field with name of file
    while ((key = getch()) != 10)
    {
        switch (key)
        {
            case 10:
                break;
            case KEY_LEFT:
                form_driver(NB_ASK_FORM, REQ_PREV_CHAR);
                break;
            case KEY_RIGHT:
                form_driver(NB_ASK_FORM, REQ_NEXT_CHAR);
                break;
            case KEY_BACKSPACE:
            case 127:
                if(NB_ASK_FORM->curcol <= 6 )
                    form_driver(NB_ASK_FORM, key);
                else
                    form_driver(NB_ASK_FORM, REQ_DEL_PREV);
                break;
            case KEY_DC:
                form_driver(NB_ASK_FORM, REQ_DEL_CHAR);
                break;
            default:
                form_driver(NB_ASK_FORM, key);
                break;
        }
        if(NB_ASK_FORM->curcol <= 6)
            NB_ASK_FORM->curcol = 6;
        wrefresh(NB_ASK_WIN);
    }
    
    
    form_driver(NB_ASK_FORM, REQ_VALIDATION);
    string buff = field_buffer(FILE_NAME_FIELD[0], 0);
    buff = buff.substr(6, buff.length());
    buff.erase(remove(buff.begin(), buff.end(), ' '), buff.end());
    
    
    // Free memory:
    unpost_form(NB_ASK_FORM);
    free_form(NB_ASK_FORM);
    free_field(FILE_NAME_FIELD[0]);
    delwin(NB_ASK_WIN);
    return buff;
}
//---------------------------------------------------------------------------------------
/*! \fn switchType(vector <CNote *> & typeNote, const int & secondPos, WINDOW * m_Win, int & typeIndex, CSearchRequest * rq)
 \param[in] typeNote list of notes to filter.
 \param[in] secondPos coordinates of element in ncurses windows to redraw.
 \param[in] m_Win ncurses window where all elements is located.
 \param[in] typeIndex by index get access to selected type of note in typeSelect array.
 \param[in] rq current request, to where will be saved result after filtering.
 \brief Function filter array of notes printed in showResultListOfSearch by type
 of note and changed elements in ncurses window belong to EditWindow class.
 */
void switchType(vector <CNote*>& typeNote, const int& secondPos, WINDOW* m_Win, int& typeIndex, CSearchRequest* rq){
    if(typeIndex != 3)
        typeIndex++;
    else typeIndex = 0;
    
    int menulength = LINES - 8;

    typeNote.clear();
    rq->getListByType(typeNote, typeSelect[typeIndex]);
    size_t size = COLS*3/4 - 4;
    string blanks(size, ' ');

    for(int i = (int)typeNote.size(); i < menulength - 1; i++){
        mvwprintw(m_Win,3 + i,1, blanks.c_str());
    }
    mvwprintw(m_Win,1, secondPos - 9, ("TAB " + typeSelect[typeIndex] + ",").c_str());
    mvwchgat( m_Win, 1, secondPos - 9 , 3, A_NORMAL, 1, NULL );
}
//---------------------------------------------------------------------------------------
int EditWindow::showResultListOfSearch(CSearchRequest * request, CSQLManager * manager, int option){
    int colmCnt  = COLS*3/4 - 4;
    int menulength = LINES - 8;
    
    int typeIndex = 0;
    string fileName;
    CNote * noteToDel = nullptr;
    m_SelPos = 0;
    wclear( m_Win );
    box( m_Win, 0, 0 );
    // Print in menu bar : Result of searching
    if(option == 10)
        mvwprintw(m_Win,1,3,searchResult.c_str());
    // Print in menu bar : Result of import
    else
        mvwprintw(m_Win,1,3,importContent.c_str());
    
    // Inicialize and adding elements to menu bar:
    int secondPos = COLS*3/4 - 6  - (int)openResult.length() - (int)deleteCommand.length();
    mvwprintw(m_Win,1, secondPos, deleteCommand.c_str());
    mvwchgat( m_Win, 1, secondPos, 2, A_NORMAL, 1, NULL );

    mvwprintw(m_Win,1, secondPos - 9, ("TAB " + typeSelect[typeIndex] + ",").c_str());
    mvwchgat( m_Win, 1, secondPos - 9 , 3, A_NORMAL, 1, NULL );
    mvwprintw(m_Win,1,COLS*3/4 - 5  - (int)openResult.length() ,openResult.c_str());
    mvwchgat( m_Win, 1, COLS*3/4 - 5  - (int)openResult.length() , 5, A_NORMAL, 1, NULL );
    mvwhline(m_Win, 2, 1, 0, COLS*3/4 - 4);
    mvwhline(m_Win, LINES - 6, 1, 0, COLS*3/4 - 4);
    mvwprintw(m_Win,LINES - 5, COLS*3/4 - 14  - (int)exportResultCSV.length() ,exportResultCSV.c_str());
    mvwchgat( m_Win, LINES - 5 , COLS*3/4 - 16 , 2, A_NORMAL, 1, NULL );
    
    mvwprintw(m_Win,LINES - 5, COLS*3/4 - 5  - (int)exportResultHTML.length() ,exportResultHTML.c_str());
    mvwchgat( m_Win, LINES - 5 , COLS*3/4 - 7 , 2, A_NORMAL, 1, NULL );
    

    vector <CNote*> resultList = request->getResultList();
    if(resultList.empty()){
        printNotice("Warning: ", "Nothing was found");
        getch();
        return 3;
    }

    int key = 0;
    while( 1 )
    {
        if(request->curSessionStatus()){
            printNotice("Warning: ", "Nothing was found");
            getch();
            return 3;
        }
        
        printItems(resultList);
        key = getch();
        
        switch(key)
        {
            case ENTER:
                if(!resultList.empty()){
                    request->setCurNoteToShow(*resultList[m_SelPos]);
                    return getType(request->getCurNote()->getType());
                }
                else{
                    printNotice("ERR:", "Nothing to select");
                    getch();
                    wclear( m_Notice );
                    wrefresh( m_Notice );
                    wrefresh(m_Win);
                }
                break;
            case KEY_F(7):
                if(!resultList.empty()){
                    fileName = getFileName();
                    if(fileName.empty()){
                        printNotice("Fail: ", "Invalid name");
                    }
                    else {
                        manager->exportSearchingResultCSV(request->getResultList(), fileName);
                        printNotice("Succ: ", "Data was exported");
                    }
                    getch();
                    wclear( m_Notice );
                    wrefresh( m_Notice );
                }
                else{
                    printNotice("ERR:", "Nothing to select");
                    getch();
                    wclear( m_Notice );
                    wrefresh( m_Notice );
                    wrefresh(m_Win);
                }
                break;
            case KEY_F(8):
                if(!resultList.empty()){
                    fileName = getFileName();
                    if(fileName.empty()){
                        printNotice("Fail: ", "Invalid name");
                    }
                    else {
                        manager->exportSearchingResultHTML(request->getResultList(), fileName);
                        printNotice("Succ: ", "Data was exported");
                    }
                    getch();
                    wclear( m_Notice );
                    wrefresh( m_Notice );
                }
                else{
                    printNotice("ERR:", "Nothing to select");
                    getch();
                    wclear( m_Notice );
                    wrefresh( m_Notice );
                    wrefresh(m_Win);
                }
                break;
            case KEY_F(9):
                return -1;
            case ESC:
                request->clearCurSession();
                return 3;
            case '\t':
                switchType(resultList, secondPos, m_Win, typeIndex, request);
                wrefresh( m_Win );
                m_SelPos = 0;
                break;
            case KEY_UP:
                if (m_SelPos)
                {
                    
                    m_SelPos--;
                    if (m_SelPos < m_Offset)
                        m_Offset--;
                }
                break;
            case KEY_DOWN:
                if (m_SelPos < (int)resultList.size()-1)
                {
                    m_SelPos++;
                    if (m_SelPos > m_Offset + menulength - 1)
                        m_Offset++;
                }
                break;
            case KEY_END:
                m_SelPos=(int)resultList.size() - 1;
                m_Offset=(int)resultList.size() - menulength;
                break;
            case KEY_BACKSPACE:
            case 127:
                if(!resultList.empty()){
                    noteToDel = resultList[m_SelPos];
                    // Remove cur note from session:
                    request->deleteNoteInCurSession(m_SelPos);
                    resultList.clear();
                    resultList = request->getResultList();
                    // Remove cur note from DB:
                    manager->delNoteFromDB(*noteToDel);
                    delete noteToDel;
                    if(m_SelPos != 0)
                        m_SelPos--;
                    printNotice("MESS:", "Note was deleted");
                    getch();
                    size_t size = colmCnt;
                    string blanks(size, ' ');
                    if((2+(int)resultList.size()) < menulength)
                        mvwprintw(m_Win,3+ (int)resultList.size(),1, blanks.c_str());
                    wclear( m_Notice );
                    wrefresh( m_Notice );
                    wrefresh(m_Win);
                }
                else{
                    printNotice("ERR:", "Nothing to select");
                    getch();
                    wclear( m_Notice );
                    wrefresh( m_Notice );
                    wrefresh(m_Win);
                }
                break;
        }
    }
    
    getch();
    
    return 3;
}
//---------------------------------------------------------------------------------------
void EditWindow::getCSVContent(const string & fileContent){
    int width  = COLS*3/4 - 5;
    int numberOffStringRows = (int)fileContent.size() / width + 1;
    
    FILE_NAME_FIELD[0] = new_field(LINES - 9, width , 0, 0, numberOffStringRows, 10);
    set_field_buffer(FILE_NAME_FIELD[0], 0, 0);
    set_field_opts(FILE_NAME_FIELD[0], O_VISIBLE | O_NULLOK | O_PUBLIC | O_EDIT | O_ACTIVE | A_UNDERLINE);
    NB_ASK_FORM = new_form(FILE_NAME_FIELD);
    
    set_form_sub(NB_ASK_FORM, derwin(panel_window(m_Panel), LINES - 9, width, 3, 1));
    set_field_buffer(FILE_NAME_FIELD[0], 0 , fileContent.c_str());

    mvwprintw(m_Win,1,COLS*3/4 - 5  - (int)importResult.length() ,importResult.c_str());
    mvwchgat( m_Win, 1 , COLS*3/4 - 5  - (int)importResult.length() , 5, A_NORMAL, 1, NULL );

    NB_ASK_WIN  =  panel_window(m_Panel);
    post_form(NB_ASK_FORM);
    
    show_panel(m_Panel);
    update_panels();
    doupdate();
    refresh();
    int key;
    
    while((key = getch()) != '\t'){
        update_panels();
        doupdate();
        refresh();
        
        switch (key) {
            case KEY_RIGHT:
                form_driver(NB_ASK_FORM, REQ_END_FIELD);
                break;
            case KEY_LEFT:
                form_driver(NB_ASK_FORM, REQ_BEG_FIELD);
                break;
            case KEY_DOWN:
                form_driver(NB_ASK_FORM, REQ_NEXT_LINE);
                break;
            case KEY_UP:
                form_driver(NB_ASK_FORM, REQ_PREV_LINE);
                break;
            default:
                break;
        }
        wrefresh(NB_ASK_WIN);
    }
    
    unpost_form(NB_ASK_FORM);
    free_form(NB_ASK_FORM);
    free_field(FILE_NAME_FIELD[0]);
    delwin(NB_ASK_WIN);
}
//---------------------------------------------------------------------------------------
/*! \fn refreshImportWindow(WINDOW * m_Win, CDirectory * dir)
 \brief Function refresh import window after each appearance of notice message.
 Needs to redraw all elements in menu bar.
 */
void refreshImportWindow(WINDOW * m_Win, CDirectory * dir){
    wclear(m_Win);
    wrefresh(m_Win);
    refresh();
    box(m_Win, 0, 0);
    
    mvwhline(m_Win, 2, 1, 0, COLS*3/4 - 4);
    mvwprintw(m_Win,1,1 , ("Path: " + dir->getRelativePath()).c_str());
    
    mvwprintw(m_Win,1,COLS*3/4 - 5  - (int)importResult.length() - 10 ,"BS del");
    mvwchgat( m_Win, 1 ,COLS*3/4 - 5  - (int)importResult.length() - 10 , 2, A_NORMAL, 1, NULL );

    
    mvwprintw(m_Win,1,COLS*3/4 - 5  - (int)importResult.length() ,importResult.c_str());
    mvwchgat( m_Win, 1 , COLS*3/4 - 5  - (int)importResult.length() , 5, A_NORMAL, 1, NULL );

    mvwhline(m_Win, LINES - 6, 1, 0, COLS*3/4 - 4);
    mvwprintw(m_Win,LINES - 5, COLS*3/4 - 5  - (int)showCSV.length() ,showCSV.c_str());
    mvwchgat( m_Win, LINES - 5 , COLS*3/4 - 5  - (int)showCSV.length() , 3, A_NORMAL, 1, NULL );
}
//---------------------------------------------------------------------------------------
int EditWindow::importNotes(CSQLManager * manager, CSearchRequest * rq){
    
    CDirectory * dir = new CDirectory("examples", "./");
    
    try{
        dir->readDirectory();
    }
    catch ( const Error & e )
    {
        printNotice( errorNotice,e.what() );
        return 3;
    }
    
    vector <string> fileList = dir->getFileList();
    m_SelPos = 0;
    printDir(fileList, dir);
    
    refreshImportWindow(m_Win, dir);
    
    if(fileList.empty()){
        printNotice("Warning: ", "Folder is empty");
        getch();
        return 3;
    }
    int   menulength = LINES - 8;
    
    int key = 0;
    vector<CNote*> curSessionUpdate;
        
    while( 1 )
    {
        
        printDir(fileList, dir);
        key = getch();
        
        switch(key)
        {
            case ENTER:
                if(dir->checkFormatImport(m_SelPos))
                {
                    try{
                        manager->importNotesToDB(curSessionUpdate, dir->returnPathToFile(m_SelPos));
                    }
                    catch(const Error & e){
                        printNotice( errorNotice,e.what() );
                        return 3;
                    }
                    rq->clearCurSession();
                    rq->updateCurSession(curSessionUpdate);
                    printNotice("MESS: ", "Was imported");
                    getch();
                    delete dir;
                    return 20;
                }
                printNotice("Fail: ", "Invalid format");
                getch();
                wclear(m_Notice);
                wrefresh( m_Notice );
                break;
            case KEY_F(9):
                delete dir;
                return -1;
            case ESC:
                delete dir;
                return 3;
            case '\t':
                if(dir->checkFormatShow(m_SelPos)){
                    
                    try{
                        if(dir->getFileList()[m_SelPos].find(".csv") != std::string::npos)
                            getCSVContent(dir->getCSVContentShow(m_SelPos));
                        else
                            dir->showHTML(m_SelPos);
                    }
                    catch(const Error & e)
                    {
                        printNotice( errorNotice,e.what() );
                        return 3;
                    }
                    refreshImportWindow(m_Win, dir);
                    break;
                }
                else
                    printNotice("Fail: ", "Invalid format");
                getch();
                wclear(m_Notice);
                wrefresh( m_Notice );
                break;
            case KEY_UP:
                if (m_SelPos)
                {
                    
                    m_SelPos--;
                    if (m_SelPos < m_Offset)
                        m_Offset--;
                }
                break;
                
            case KEY_DOWN:
                if (m_SelPos < (int)fileList.size()-1)
                {
                    m_SelPos++;
                    if (m_SelPos > m_Offset + menulength - 1)
                        m_Offset++;
                }
                break;
            case KEY_END:
                m_SelPos=(int)fileList.size() - 1;
                m_Offset=(int)fileList.size() - menulength;
                break;
            case KEY_BACKSPACE:
            case 127:
                if(dir->checkFormatShow(m_SelPos))
                {
                    int indexToClear = (int)fileList.size() - 1;
                    try{
                        dir->delCSV(fileList[m_SelPos]);
                        dir->readDirectory();
                    }
                    catch ( const Error & e )
                    {
                        printNotice( errorNotice,e.what() );
                        return 3;
                    }
                    fileList = dir->getFileList();
                    m_SelPos = 0;
                    size_t size = COLS*3/4 - 4;
                    string blanks(size, ' ');
                    mvwprintw(m_Win,3 + indexToClear ,1, blanks.c_str());
                    printNotice("MESS: ", "Was deleted");
                    getch();
                }
                else{
                    printNotice("Fail: ", "Invalid format");
                    getch();
                }
                wclear(m_Notice);
                wrefresh( m_Notice );
                break;
        }
    }

    return 3;
}
//---------------------------------------------------------------------------------------


