#include "EditWindowShopList.h"

static WINDOW*  NB_ASK_WIN;
static FORM*    NB_ASK_FORMS[200];
static FIELD*   NB_FIELDS[200][2];

//---------------------------------------------------------------------------------------
EditWindowShopList::EditWindowShopList(int h, int w, int x, int y ): EditWindow(h,w,x,y){}
//---------------------------------------------------------------------------------------

EditWindowShopList::~EditWindowShopList(){}

//---------------------------------------------------------------------------------------

void EditWindowShopList::closeInputAndFree( void )const
{
    int shift = LINES - 7 - 2;
    for(int i = 0; i < LINES-7 + shift; i++){
        unpost_form(NB_ASK_FORMS[i]);
        free_form(NB_ASK_FORMS[i]);
        free_field(NB_FIELDS[i][0]);
    }
    
    
    delwin(NB_ASK_WIN);
}

//---------------------------------------------------------------------------------------

void EditWindowShopList::initEditField(int linesCnt, int colmCnt){
    int shift = linesCnt - 2;
    
    for(int i = 0; i < linesCnt; i++){
        if(i > 1 && i < linesCnt - 1){
            NB_FIELDS[i][0] = new_field(1, colmCnt/2, 0, 0, 0, 0);
            set_field_buffer(NB_FIELDS[i][0], 0, 0);
            set_field_opts(NB_FIELDS[i][0], O_VISIBLE | O_STATIC | O_PUBLIC | O_EDIT | O_ACTIVE | A_UNDERLINE);
            NB_ASK_FORMS[i] = new_form(NB_FIELDS[i]);
            set_form_sub(NB_ASK_FORMS[i], derwin(panel_window(m_Panel), 1, colmCnt/2, 3 + i, 1));

          
            NB_FIELDS[i + shift][0] = new_field(1, colmCnt/2 - 2, 0, 0, 0, 0);
            set_field_buffer(NB_FIELDS[i + shift][0], 0, 0);
            set_field_opts(NB_FIELDS[i + shift][0], O_VISIBLE | O_STATIC | O_PUBLIC | O_EDIT | O_ACTIVE | A_UNDERLINE);
            NB_ASK_FORMS[i + shift] = new_form(NB_FIELDS[i + shift]);
            set_form_sub(NB_ASK_FORMS[i + shift], derwin(panel_window(m_Panel), 1, colmCnt/2 - 2, 3 + i, colmCnt/2 + 1));

        }
        else{
            NB_FIELDS[i][0] = new_field(1, colmCnt, 0, 0, 0, 0);
            set_field_buffer(NB_FIELDS[i][0], 0, 0);
            set_field_opts(NB_FIELDS[i][0], O_VISIBLE | O_STATIC | O_PUBLIC | O_EDIT | O_ACTIVE | A_UNDERLINE);
            NB_ASK_FORMS[i] = new_form(NB_FIELDS[i]);
            set_form_sub(NB_ASK_FORMS[i], derwin(panel_window(m_Panel), 1, colmCnt, 3 + i, 1));
        }
    }
    
    set_field_back(NB_FIELDS[0][0], A_UNDERLINE);
    set_field_buffer(NB_FIELDS[0][0], 0, nameField.c_str());
    set_field_back(NB_FIELDS[1][0], A_UNDERLINE);
    
    set_field_buffer(NB_FIELDS[1][0], 0, tagField.c_str());
    
    
    NB_ASK_WIN  =  panel_window(m_Panel);
    for(int i = 0; i < linesCnt; i++){
        if(i > 1 && i < linesCnt - 1)
            post_form(NB_ASK_FORMS[i + shift]);
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

int  EditWindowShopList::createNote(CSQLManager * mn)
{
    // Define size of active space:
    int linesCnt = LINES - 7;
    int colmCnt  = COLS*3/4 - 4;
    int shift = linesCnt - 2;
    int curShift = 0;

    initEditField(linesCnt, colmCnt);
    set_field_buffer(NB_FIELDS[linesCnt - 1][0], 0, (typeName + " " + typeOptions[2]).c_str());
    update_panels();
    refresh();
    
    for( int i = 2; i < linesCnt - 1; i++){
        set_field_buffer(NB_FIELDS[i][0], 0, "-");
        set_field_buffer(NB_FIELDS[i + shift][0], 0, "|");
        set_field_back(NB_FIELDS[i + shift][0], A_BOLD);
    }
    set_field_back(NB_FIELDS[linesCnt - 2][0], A_UNDERLINE);
    set_field_back(NB_FIELDS[linesCnt - 2 + shift][0], A_UNDERLINE);
    
    update_panels();
    doupdate();
    refresh();
    
    int key = 0;
    int index = 0;
    
    while ((key = getch()) != KEY_F(6))
    {
        
        update_panels();
        doupdate();
        refresh();
        
        if(NB_ASK_FORMS[index + curShift]->curcol <= 2)
            NB_ASK_FORMS[index + curShift]->curcol = 2;

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
                if(index == (LINES - 9) || index == ((LINES - 9) + linesCnt - 2))
                    index = 0;
                else
                    index++;
                
                form_driver(NB_ASK_FORMS[index + curShift], REQ_DOWN_FIELD);
                if(index == 0 || index == 1) NB_ASK_FORMS[index]->curcol = 6;
                break;
            case KEY_UP:
                if(index == 0)
                    index = (LINES - 9);
                else
                    index--;
                
                form_driver(NB_ASK_FORMS[index + curShift], REQ_UP_FIELD);
                if(index == 0 || index == 1) NB_ASK_FORMS[index]->curcol = 6;
                break;
            case KEY_LEFT:
                if((index == 0 || index == 1) && NB_ASK_FORMS[index]->curcol <= 6)
                    form_driver(NB_ASK_FORMS[index + curShift], key);
                else
                    form_driver(NB_ASK_FORMS[index + curShift], REQ_PREV_CHAR);
                break;
            case KEY_RIGHT:
                form_driver(NB_ASK_FORMS[index + curShift], REQ_NEXT_CHAR);
                break;
            case KEY_BACKSPACE:
            case 127:
                if((NB_ASK_FORMS[index]->curcol == 0 && index != 0) || (NB_ASK_FORMS[index]->curcol == 6 && index == 1)){
                    index--;
                    form_driver(NB_ASK_FORMS[index + curShift], REQ_END_LINE);
                }
                else if((index == 0 || index == 1) && NB_ASK_FORMS[index]->curcol <= 5)
                    form_driver(NB_ASK_FORMS[index + curShift], key);
                else
                    form_driver(NB_ASK_FORMS[index + curShift], REQ_DEL_PREV);
                break;
            case '\t':
                if(index > 1 && index < linesCnt - 1){
                    if(curShift == 0)
                        curShift = linesCnt - 2;
                    else
                        curShift = 0;
                }
                form_driver(NB_ASK_FORMS[index + curShift], key);
                break;
            case KEY_DC:
                form_driver(NB_ASK_FORMS[index + curShift], REQ_DEL_CHAR);
                break;
            default:
                form_driver(NB_ASK_FORMS[index + curShift], key);
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
        checkIfSpace = checkIfSpace.substr(1, checkIfSpace.size());
        if(!(checkIfSpace.find_first_not_of (' ') == checkIfSpace.npos))
            finalIndex = i;
    }
    
    // Check if contant is not empty
    int fullPrice = 0;
    string tmp;
    string buffText = "";
    for(int i = 2; i < finalIndex + 1; i++){
        // buffer the synchronize
        string price;

        form_driver(NB_ASK_FORMS[i + shift], REQ_VALIDATION);
        
        tmp = field_buffer(NB_FIELDS[i][0], 0);
        tmp.erase(remove(tmp.begin(), tmp.end(), '\n'), tmp.end());

        buffText += tmp;
        
        price = field_buffer(NB_FIELDS[i + shift][0], 0);

        tmp = price.substr(1, price.size());
        tmp.erase(remove(tmp.begin(), tmp.end(), ' '), tmp.end());
        tmp.erase(remove(tmp.begin(), tmp.end(), '\n'), tmp.end());
        if(!tmp.empty())
            fullPrice += stoi(tmp);
        buffText += ("| " + tmp);
        buffText += "\n";

    }

    if( !checkIfNotEmptyInput((char*)buffText.c_str(),"Note cannot be empty.")){
        return 3;
    }
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
    CNote* note = new CNoteShopList(title, typeOptions[2], buffText, "PlainText", fullPrice);
    
    
    mn->addNote(*note, storTags);
    printNotice( "Full price: ", to_string(fullPrice));
    getch();
    
    printNotice( "MESS: ", "Note was saved");
    getch();
    wclear( m_Notice );
    wrefresh(m_Notice);
    
    delete [] buffName;
    delete [] buffTags;
    return 3;
}
//---------------------------------------------------------------------------------------

void EditWindowShopList::updateFieldsAfterNotice(const int limit, const int curInd, const int curPos){
    int shift = LINES - 9;
    
    for(int i = 2; i < LINES-7 + shift; i++){
         form_driver(NB_ASK_FORMS[i], REQ_DOWN_FIELD);
    }
    
    form_driver(NB_ASK_FORMS[curInd], REQ_BEG_FIELD);
    NB_ASK_FORMS[curInd]->curcol = curPos;
}
//---------------------------------------------------------------------------------------

int EditWindowShopList::showNote(CSQLManager * mn, CSearchRequest * rq){
    // Define size of active space:
    int linesCnt = LINES - 7;
    int colmCnt  = COLS*3/4 - 4;
    int shift = linesCnt - 2;
    int curShift = 0;

    initEditField(linesCnt, colmCnt);
    
    mvwprintw(m_Win,1,COLS*3/4 - 5  - (int)labelUpdate.length() ,labelUpdate.c_str());
    mvwchgat( m_Win, 1, COLS*3/4 - 5  - (int)labelUpdate.length() , 2, A_NORMAL, 1, NULL );
    
    mvwprintw(m_Win,1, 1 , (typeName + " " + typeOptions[2] + " | Full_Price: " + to_string(rq->getCurNote()->getPrice())).c_str());
    wrefresh(m_Win);
    
    mvwprintw(m_Win,LINES - 5, COLS*3/4 - 14  - (int)exportResultCSV.length() ,exportResultCSV.c_str());
    mvwchgat( m_Win, LINES - 5 , COLS*3/4 - 16 , 2, A_NORMAL, 1, NULL );
    
    mvwprintw(m_Win,LINES - 5, COLS*3/4 - 5  - (int)exportResultHTML.length() ,exportResultHTML.c_str());
    mvwchgat( m_Win, LINES - 5 , COLS*3/4 - 7 , 2, A_NORMAL, 1, NULL );

    
    set_field_buffer(NB_FIELDS[0][0], 0, (nameField + rq->getCurNote()->getTitle()).c_str());

    vector <string> content;
    
    rq->getCurNote()->prepareContent(content);
    
    mvwprintw(m_Win,1,COLS*3/4 - 5  - (int)labelUpdate.length() ,labelUpdate.c_str());
    mvwchgat( m_Win, 1, COLS*3/4 - 5  - (int)labelUpdate.length() , 2, A_NORMAL, 1, NULL );
    
    
    for(int i = 0; i < (int)content.size()/2; i++){
        set_field_buffer(NB_FIELDS[2 + i][0], 0, content[2*i].c_str());
        set_field_buffer(NB_FIELDS[2 + i + shift][0], 0, ("|" + content[2*i + 1]).c_str());
        set_field_back(NB_FIELDS[2 + i + shift][0], A_BOLD);

    }

    int printRestOf = 2 + (int)content.size()/2;
    for(int i = printRestOf; i < linesCnt - 1; i++){
        set_field_buffer(NB_FIELDS[i][0], 0, "-");
        set_field_buffer(NB_FIELDS[i + shift][0], 0, "|");
        set_field_back(NB_FIELDS[i + shift][0], A_BOLD);
    }

    set_field_back(NB_FIELDS[linesCnt - 2][0], A_UNDERLINE);
    set_field_back(NB_FIELDS[linesCnt - 2 + shift][0], A_UNDERLINE);
    
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
        
        if(NB_ASK_FORMS[index + curShift]->curcol <= 2)
            NB_ASK_FORMS[index + curShift]->curcol = 2;
        
        switch (key)
        {
            case ESC:
                closeInputAndFree();
                return 10;
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
                updateFieldsAfterNotice((LINES - 9), (index + curShift), NB_ASK_FORMS[index + curShift]->curcol);
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
            case KEY_F(9):
                printNotice( "HINT: ","Force exit" );
                getch();
                closeInputAndFree();
                return -1;
            case 10:
            case KEY_DOWN:
                if(index == (LINES - 9) || index == ((LINES - 9) + linesCnt - 2))
                    index = 0;
                else
                    index++;
                
                form_driver(NB_ASK_FORMS[index + curShift], REQ_DOWN_FIELD);
                if(index == 0 || index == 1) NB_ASK_FORMS[index]->curcol = 6;
                break;
            case KEY_UP:
                if(index == 0)
                    index = (LINES - 9);
                else
                    index--;
                
                form_driver(NB_ASK_FORMS[index + curShift], REQ_UP_FIELD);
                if(index == 0 || index == 1) NB_ASK_FORMS[index]->curcol = 6;
                break;
            case KEY_LEFT:
                if((index == 0 || index == 1) && NB_ASK_FORMS[index]->curcol <= 6)
                    form_driver(NB_ASK_FORMS[index + curShift], key);
                else
                    form_driver(NB_ASK_FORMS[index + curShift], REQ_PREV_CHAR);
                break;
            case KEY_RIGHT:
                form_driver(NB_ASK_FORMS[index + curShift], REQ_NEXT_CHAR);
                break;
            case KEY_BACKSPACE:
            case 127:
                if((NB_ASK_FORMS[index]->curcol == 0 && index != 0) || (NB_ASK_FORMS[index]->curcol == 6 && index == 1)){
                    index--;
                    form_driver(NB_ASK_FORMS[index + curShift], REQ_END_LINE);
                }
                else if((index == 0 || index == 1) && NB_ASK_FORMS[index]->curcol <= 5)
                    form_driver(NB_ASK_FORMS[index + curShift], key);
                else
                    form_driver(NB_ASK_FORMS[index + curShift], REQ_DEL_PREV);
                break;
            case '\t':
                if(index > 1 && index < linesCnt - 1){
                    if(curShift == 0)
                        curShift = linesCnt - 2;
                    else
                        curShift = 0;
                }
                form_driver(NB_ASK_FORMS[index + curShift], key);
                break;
            case KEY_DC:
                form_driver(NB_ASK_FORMS[index + curShift], REQ_DEL_CHAR);
                break;
            default:
                form_driver(NB_ASK_FORMS[index + curShift], key);
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
        checkIfSpace = checkIfSpace.substr(1, checkIfSpace.size());
        if(!(checkIfSpace.find_first_not_of (' ') == checkIfSpace.npos))
            finalIndex = i;
    }
    
    
    // Check if contant is not empty
    int fullPrice = 0;
    string tmp;
    string buffText = "";
    for(int i = 2; i < finalIndex + 1; i++){
        // buffer the synchronize
            string price;
        
            tmp = field_buffer(NB_FIELDS[i][0], 0);
            tmp.erase(remove(tmp.begin(), tmp.end(), '\n'), tmp.end());
            buffText += tmp;
            form_driver(NB_ASK_FORMS[i + shift], REQ_VALIDATION);
            price = field_buffer(NB_FIELDS[i + shift][0], 0);
            tmp = price.substr(1, price.size());
            tmp.erase(remove(tmp.begin(), tmp.end(), ' '), tmp.end());
            tmp.erase(remove(tmp.begin(), tmp.end(), '\n'), tmp.end());
            if(!tmp.empty())
                fullPrice += stoi(tmp);
            buffText += ("| " + tmp);
            buffText += "\n";
    }
    

    if( !checkIfNotEmptyInput((char*)buffText.c_str(),"Note cannot be empty.")){
        return 10;
    }
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
    rq->getCurNote()->updateInfo(title, buffText, "PlainText", fullPrice);
    mn->addingTagsToExistedNote(storTags, *rq->getCurNote());
    // Update info in global DB:
    mn->updateInfoDB(IdNote, storTags, *rq->getCurNote());
    
    printNotice( "Full price: ", to_string(fullPrice));
    getch();
    printNotice( "MESS: ", "Note was updated");
    getch();
    wclear( m_Notice );
    wrefresh(m_Notice);
    
    delete [] buffName;
    delete [] buffTags;
    return 10;
}
