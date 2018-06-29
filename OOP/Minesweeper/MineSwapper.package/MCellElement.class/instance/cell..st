accessing
cell: aMCell
          cell := aMCell.
			 cell announcer when: MCellOpenedAnnouncement send: #openedCell to: self.
			 cell announcer when: MCellMarkedAnnouncement send: #markedCell to: self.
			 cell announcer when: MCellUnMarkedAnnouncement send: #unmarkedCell to: self.
"the setter will be place to hook registra- tion for the communication between the model and the view."