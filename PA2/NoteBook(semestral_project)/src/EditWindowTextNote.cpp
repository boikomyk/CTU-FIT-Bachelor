#include "EditWindowTextNote.h"

static WINDOW*  NB_ASK_WIN;
static FORM*    NB_ASK_FORMS[100];
static FIELD*   NB_FIELDS[100][2];

//---------------------------------------------------------------------------------------

EditWindowTextNote::EditWindowTextNote(int h, int w, int x, int y ): EditWindow(h,w,x,y){}
//---------------------------------------------------------------------------------------

EditWindowTextNote::~EditWindowTextNote(){}

//---------------------------------------------------------------------------------------

void EditWindowTextNote::closeInputAndFree( void )const
{
    for(int i = 0; i < LINES-7; i++){
        unpost_form(NB_ASK_FORMS[i]);
        free_form(NB_ASK_FORMS[i]);
        free_field(NB_FIELDS[i][0]);
    }
        delwin(NB_ASK_WIN);
}

//---------------------------------------------------------------------------------------

void EditWindowTextNote::initEditField(int linesCnt, int colmCnt){
    
    for(int i = 0; i < linesCnt; i++){
        NB_FIELDS[i][0] = new_field(1, colmCnt, 0, 0, 0, 0);
        set_field_buffer(NB_FIELDS[i][0], 0, 0);
        set_field_opts(NB_FIELDS[i][0], O_VISIBLE | O_STATIC | O_PUBLIC | O_EDIT | O_ACTIVE | A_UNDERLINE);
        NB_ASK_FORMS[i] = new_form(NB_FIELDS[i]);
        set_form_sub(NB_ASK_FORMS[i], derwin(panel_window(m_Panel), 1, colmCnt, 3 + i, 1));
    }
    
    set_field_back(NB_FIELDS[0][0], A_UNDERLINE);
    set_field_buffer(NB_FIELDS[0][0], 0, nameField.c_str());
    set_field_back(NB_FIELDS[1][0], A_UNDERLINE);
    set_field_buffer(NB_FIELDS[1][0], 0, tagField.c_str());
    
    set_field_back(NB_FIELDS[linesCnt - 2][0], A_UNDERLINE);
    
    
    NB_ASK_WIN  =  panel_window(m_Panel);
    for(int i = 0; i < linesCnt; i++){
        post_form(NB_ASK_FORMS[i]);
    }
    
    show_panel(m_Panel);
    update_panels();
    doupdate();
    refresh();
    
    wrefresh(NB_ASK_WIN);
    
    NB_ASK_FORMS[0]->curcol = 6;
}

//---------------------------------------------------------------------------------------

bool hasOnlySpaces(const std::string& str) {
    return str.find_first_not_of (' ') == str.npos;
}
//---------------------------------------------------------------------------------------

int  EditWindowTextNote::createNote(CSQLManager * mn)
{
    // Define size of active space:
    int linesCnt = LINES - 7;
    int colmCnt  = COLS*3/4 - 4;
    
    initEditField(linesCnt, colmCnt);
    set_field_buffer(NB_FIELDS[linesCnt - 1][0], 0, (typeName + " " + typeOptions[0]).c_str());
    update_panels();
    refresh();

    int key = 0;
    int index = 0;
    
    while ((key = getch()) != KEY_F(6))
    {
        
        update_panels();
        doupdate();
        refresh();
        
        switch (key)
        {
            case ESC:
                closeInputAndFree();
                return 3;
            case KEY_F(9):
                printNotice( "HINT: ","Force exit" );
                getch();
                closeInputAndFree();
                return -1;
            case 10:
            case KEY_DOWN:
                if(index == (LINES - 9))
                    index = 0;
                else
                    index++;
                
                form_driver(NB_ASK_FORMS[index], REQ_DOWN_FIELD);
                if(index == 0 || index == 1) NB_ASK_FORMS[index]->curcol = 6;
                break;
            case KEY_UP:
                if(index == 0)
                    index = (LINES - 9);
                else
                    index--;
                
                form_driver(NB_ASK_FORMS[index], REQ_UP_FIELD);
                if(index == 0 || index == 1) NB_ASK_FORMS[index]->curcol = 6;
                break;
            case KEY_LEFT:
                if((index == 0 || index == 1) && NB_ASK_FORMS[index]->curcol <= 6)
                    form_driver(NB_ASK_FORMS[index], key);
                else
                    form_driver(NB_ASK_FORMS[index], REQ_PREV_CHAR);
                break;
            case KEY_RIGHT:
                form_driver(NB_ASK_FORMS[index], REQ_NEXT_CHAR);
                break;
            case KEY_BACKSPACE:
            case 127:
                if((NB_ASK_FORMS[index]->curcol == 0 && index != 0) || (NB_ASK_FORMS[index]->curcol == 6 && index == 1)){
                    index--;
                    form_driver(NB_ASK_FORMS[index], REQ_END_LINE);
                }
                else if((index == 0 || index == 1) && NB_ASK_FORMS[index]->curcol <= 5)
                    form_driver(NB_ASK_FORMS[index], key);
                else
                    form_driver(NB_ASK_FORMS[index], REQ_DEL_PREV);
                break;
            case KEY_DC:
                form_driver(NB_ASK_FORMS[index], REQ_DEL_CHAR);
                break;
            default:
                form_driver(NB_ASK_FORMS[index], key);
                break;
        }
        
        wrefresh(NB_ASK_WIN);
    }


    string checkIfSpace;
    int finalIndex = 2;
    for(int i = 2; i <  linesCnt - 1; i++){
        // buffer the synchronize
        form_driver(NB_ASK_FORMS[i], REQ_VALIDATION);
        checkIfSpace = field_buffer(NB_FIELDS[i][0], 0);
        if(!hasOnlySpaces(checkIfSpace))
            finalIndex = i;
    }
    
    // Check if contant is not empty
    string buffText = "";
    for(int i = 2; i < finalIndex + 1; i++){
        // buffer synchronize
        buffText += field_buffer(NB_FIELDS[i][0], 0);
        buffText += "\n";
    }
    if( !checkIfNotEmptyInput((char*)buffText.c_str(),"Note cannot be empty."))
        return 3;

    // Check if line name is not empty
    char * buffName = new char[colmCnt * 2];
    form_driver(NB_ASK_FORMS[0], REQ_VALIDATION);
    snprintf(buffName, colmCnt - 4, "%s", field_buffer(NB_FIELDS[0][0], 0));

    if( !checkIfNotEmptyInput(buffName,"NAME cannot be empty.")){
        delete [] buffName;
        return 3;
    }
    
    // Check if line tags in not empty
    char * buffTags = new char[colmCnt * 2];
    form_driver(NB_ASK_FORMS[1], REQ_VALIDATION);
    snprintf(buffTags, colmCnt - 4, "%s", field_buffer(NB_FIELDS[1][0], 0));

    if( !checkIfNotEmptyInput(buffTags,"TAGS cannot be empty.")){
        delete [] buffName;
        delete [] buffTags;
        return 3;
    }
    
    //Close input and free memory
    closeInputAndFree();
    
    // Insert to Database
    string title = string(buffName).substr(5, strlen(buffName));
    string tags = string(buffTags).substr(5, strlen(buffTags));
    set<string> storTags;
    
    splitStringToWords(tags,storTags);
    CNote* note = new CNoteText(title, typeOptions[0], buffText, "PlainText", 0);

    
    mn->addNote(*note, storTags);
    
    printNotice( "MESS: ", "Note was saved");
    getch();
    wclear( m_Notice );
    wrefresh(m_Notice);
    
    delete [] buffName;
    delete [] buffTags;
    return 3;
}
//---------------------------------------------------------------------------------------

void EditWindowTextNote::updateFieldsAfterNotice(const int limit, const int curInd, const int curPos){
    for(int i = 2; i < LINES-7; i++){
        form_driver(NB_ASK_FORMS[i], REQ_DOWN_FIELD);
    }
    form_driver(NB_ASK_FORMS[curInd], REQ_BEG_FIELD);
    NB_ASK_FORMS[curInd]->curcol = curPos;
}
//---------------------------------------------------------------------------------------
int EditWindowTextNote::showNote(CSQLManager * mn, CSearchRequest * rq){

    // Define size of active space:
    int linesCnt = LINES - 7;
    int colmCnt  = COLS*3/4 - 4;

    initEditField(linesCnt, colmCnt);
    
    set_field_buffer(NB_FIELDS[0][0], 0, (nameField + rq->getCurNote()->getTitle()).c_str());

    vector <string> content;

    rq->getCurNote()->prepareContent(content);

    mvwprintw(m_Win,1,COLS*3/4 - 5  - (int)labelUpdate.length() ,labelUpdate.c_str());
    mvwchgat( m_Win, 1, COLS*3/4 - 5  - (int)labelUpdate.length() , 2, A_NORMAL, 1, NULL );

    mvwprintw(m_Win,1, 1 , (typeName + " " + typeOptions[0]).c_str());
    wrefresh(m_Win);
    
    mvwprintw(m_Win,LINES - 5, COLS*3/4 - 14  - (int)exportResultCSV.length() ,exportResultCSV.c_str());
    mvwchgat( m_Win, LINES - 5 , COLS*3/4 - 16 , 2, A_NORMAL, 1, NULL );
    
    mvwprintw(m_Win,LINES - 5, COLS*3/4 - 5  - (int)exportResultHTML.length() ,exportResultHTML.c_str());
    mvwchgat( m_Win, LINES - 5 , COLS*3/4 - 7 , 2, A_NORMAL, 1, NULL );
    
    for(int i = 0; i < (int)content.size(); i++){
        set_field_buffer(NB_FIELDS[2 + i][0], 0, content[i].c_str());
    }

    update_panels();
    doupdate();
    refresh();
    
    
    int key = 0;
    int index = 0;
    string fileName;
    while ((key = getch()) != KEY_F(6))
    {
        
        update_panels();
        doupdate();
        refresh();
        
        switch (key)
        {
            case ESC:
                closeInputAndFree();
                return 10;
            case KEY_F(9):
                printNotice( "HINT: ","Force exit" );
                getch();
                closeInputAndFree();
                return -1;
            case KEY_F(7):
                fileName = getFileName();
                if(fileName.empty()){
                    printNotice("Fail: ", "Invalid name");
                }
                else {
                    vector <CNote *> exportRes;
                    exportRes.push_back(rq->getCurNote());
                    mn->exportSearchingResultCSV(exportRes, fileName);
                    printNotice("Succ: ", "Data was exported");
                }
                getch();
                wclear( m_Notice );
                wrefresh( m_Notice );
                updateFieldsAfterNotice((LINES - 9), index, NB_ASK_FORMS[index]->curcol);
                break;
            case KEY_F(8):
                fileName = getFileName();
                if(fileName.empty()){
                    printNotice("Fail: ", "Invalid name");
                }
                else {
                    vector <CNote *> exportRes;
                    exportRes.push_back(rq->getCurNote());
                    mn->exportSearchingResultHTML(exportRes, fileName);
                    printNotice("Succ: ", "Data was exported");
                }
                getch();
                wclear( m_Notice );
                wrefresh( m_Notice );
                updateFieldsAfterNotice((LINES - 9), index, NB_ASK_FORMS[index]->curcol);
                break;
            case 10:
            case KEY_DOWN:
                if(index == (LINES - 9))
                    index = 0;
                else
                    index++;
                
                form_driver(NB_ASK_FORMS[index], REQ_DOWN_FIELD);
                if(index == 0 || index == 1) NB_ASK_FORMS[index]->curcol = 6;
                break;
            case KEY_UP:
                if(index == 0)
                    index = (LINES - 9);
                else
                    index--;
                
                form_driver(NB_ASK_FORMS[index], REQ_UP_FIELD);
                if(index == 0 || index == 1) NB_ASK_FORMS[index]->curcol = 6;
                break;
            case KEY_LEFT:
                if((index == 0 || index == 1) && NB_ASK_FORMS[index]->curcol <= 6)
                    form_driver(NB_ASK_FORMS[index], key);
                else
                    form_driver(NB_ASK_FORMS[index], REQ_PREV_CHAR);
                break;
            case KEY_RIGHT:
                form_driver(NB_ASK_FORMS[index], REQ_NEXT_CHAR);
                break;
            case KEY_BACKSPACE:
            case 127:
                if((NB_ASK_FORMS[index]->curcol == 0 && index != 0) || (NB_ASK_FORMS[index]->curcol == 6 && index == 1)){
                    index--;
                    form_driver(NB_ASK_FORMS[index], REQ_END_LINE);
                }
                else if((index == 0 || index == 1) && NB_ASK_FORMS[index]->curcol <= 5)
                    form_driver(NB_ASK_FORMS[index], key);
                else
                    form_driver(NB_ASK_FORMS[index], REQ_DEL_PREV);
                break;
            case KEY_DC:
                form_driver(NB_ASK_FORMS[index], REQ_DEL_CHAR);
                break;
            default:
                form_driver(NB_ASK_FORMS[index], key);
                break;
        }
        
        wrefresh(NB_ASK_WIN);
    }

    string checkIfSpace;
    int finalIndex = 2;
    for(int i = 2; i <  linesCnt - 1; i++){
        // buffer the synchronize
        form_driver(NB_ASK_FORMS[i], REQ_VALIDATION);
        checkIfSpace = field_buffer(NB_FIELDS[i][0], 0);
        if(!hasOnlySpaces(checkIfSpace))
            finalIndex = i;
    }
    
    // Check if contant is not empty
    string buffText = "";
    for(int i = 2; i < finalIndex + 1; i++){
        // buffer synchronize
        buffText += field_buffer(NB_FIELDS[i][0], 0);
        buffText += "\n";
    }
    if( !checkIfNotEmptyInput((char*)buffText.c_str(),"Note cannot be empty."))
        return 10;
    
    // Check if line name is not empty
    char * buffName = new char[colmCnt * 2];
    form_driver(NB_ASK_FORMS[0], REQ_VALIDATION);
    snprintf(buffName, colmCnt - 4, "%s", field_buffer(NB_FIELDS[0][0], 0));
    
    if( !checkIfNotEmptyInput(buffName,"NAME cannot be empty.")){
        delete [] buffName;
        return 10;
    }
    
    // Check if line tags in not empty
    char * buffTags = new char[colmCnt * 2];
    form_driver(NB_ASK_FORMS[1], REQ_VALIDATION);
    snprintf(buffTags, colmCnt - 4, "%s", field_buffer(NB_FIELDS[1][0], 0));
    
    
    //Close input and free memory
    closeInputAndFree();
    
    // Insert to Database
    string title = string(buffName).substr(5, strlen(buffName));
    string tags = string(buffTags).substr(5, strlen(buffTags));
    set<string> storTags;
    
    splitStringToWords(tags,storTags);
  
    // get idNote in DB:
    int IdNote = mn->getIdNoteDB(*rq->getCurNote());
    // Update info in local storage DB:
    rq->getCurNote()->updateInfo(title, buffText, "PlainText", 0);
    mn->addingTagsToExistedNote(storTags, *rq->getCurNote());

    // Update info in global DB:
    mn->updateInfoDB(IdNote, storTags, *rq->getCurNote());
    
    
    printNotice( "MESS: ", "Note was updated");
    getch();
    wclear( m_Notice );
    wrefresh(m_Notice);
    
    delete [] buffName;
    delete [] buffTags;
    
    return 10;
}
//---------------------------------------------------------------------------------------

