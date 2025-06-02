// UI state
let students = [];

// Add a student to the list
function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const preference1 = document.getElementById('preference1').value.trim();
    const preference2 = document.getElementById('preference2').value.trim();
    const preference3 = document.getElementById('preference3').value.trim();
    const restriction1 = document.getElementById('restriction1').value.trim();
    const restriction2 = document.getElementById('restriction2').value.trim();
    const restriction3 = document.getElementById('restriction3').value.trim();
    
    if (!name) {
        alert('Vul een naam in');
        return;
    }
    
    const student = {
        name: name,
        preferences: [preference1, preference2, preference3].filter(p => p),
        restrictions: [restriction1, restriction2, restriction3].filter(r => r)
    };
    
    students.push(student);
    updateStudentList();
    clearForm();
}

// Remove a student from the list
function removeStudent(index) {
    students.splice(index, 1);
    updateStudentList();
}

// Update the student list display
function updateStudentList() {
    const list = document.getElementById('studentList');
    list.innerHTML = '';
    
    students.forEach((student, index) => {
        const item = document.createElement('div');
        item.className = 'student-item';
        
        const info = document.createElement('div');
        info.className = 'student-info';
        
        const name = document.createElement('div');
        name.className = 'student-name';
        name.textContent = student.name;
        
        const preferences = document.createElement('div');
        preferences.className = 'student-preferences';
        
        // Format preferences
        const formattedPreferences = student.preferences
            .filter(p => p.trim() !== '')
            .join(', ');
        
        // Format restrictions
        const formattedRestrictions = student.restrictions
            .filter(r => r.trim() !== '')
            .join(', ');
        
        preferences.textContent = `Voorkeuren: ${formattedPreferences || 'Geen'} | Restricties: ${formattedRestrictions || 'Geen'}`;
        
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-student';
        removeButton.textContent = '×';
        removeButton.onclick = () => removeStudent(index);
        
        info.appendChild(name);
        info.appendChild(preferences);
        item.appendChild(info);
        item.appendChild(removeButton);
        list.appendChild(item);
    });
}

// Clear the input form
function clearForm() {
    document.getElementById('studentName').value = '';
    document.getElementById('preference1').value = '';
    document.getElementById('preference2').value = '';
    document.getElementById('preference3').value = '';
    document.getElementById('restriction1').value = '';
    document.getElementById('restriction2').value = '';
    document.getElementById('restriction3').value = '';
}

// Display the results
function displayResults(result) {
    const container = document.getElementById('results');
    container.innerHTML = '';
    
    const score = document.createElement('div');
    score.className = 'summary-box';
    score.innerHTML = `
        <h2>Resultaat</h2>
        <p>Totale score: ${result.score}</p>
    `;
    container.appendChild(score);

    // Add summary section
    const summary = document.createElement('div');
    summary.className = 'summary-section';
    
    // Check restrictions
    const restrictionSummary = document.createElement('div');
    restrictionSummary.innerHTML = '<h3>Restricties</h3>';
    const restrictionList = document.createElement('ul');
    restrictionList.className = 'summary-list';
    
    let allRestrictionsMet = true;
    result.groups.forEach((group, groupIndex) => {
        group.forEach(student => {
            student.restrictions.forEach(restriction => {
                if (restriction) {
                    const hasRestriction = group.some(s => s.name === restriction);
                    if (hasRestriction) {
                        allRestrictionsMet = false;
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <svg class="status-icon status-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            ${student.name} en ${restriction} zijn in dezelfde groep (Groep ${groupIndex + 1})
                        `;
                        restrictionList.appendChild(li);
                    }
                }
            });
        });
    });

    if (allRestrictionsMet) {
        const li = document.createElement('li');
        li.innerHTML = `
            <svg class="status-icon status-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7"/>
            </svg>
            Alle restricties zijn nageleefd
        `;
        restrictionList.appendChild(li);
    }
    restrictionSummary.appendChild(restrictionList);
    summary.appendChild(restrictionSummary);

    // Check preferences by priority
    const preferenceSummary = document.createElement('div');
    preferenceSummary.innerHTML = '<h3>Voorkeuren</h3>';
    const preferenceList = document.createElement('ul');
    preferenceList.className = 'summary-list';

    let totalPreferences = [0, 0, 0]; // [1e, 2e, 3e voorkeuren]
    let metPreferences = [0, 0, 0];   // [1e, 2e, 3e voorkeuren]

    result.groups.forEach((group, groupIndex) => {
        group.forEach(student => {
            student.preferences.forEach((preference, index) => {
                if (preference) {
                    totalPreferences[index]++;
                    const hasPreference = group.some(s => s.name === preference);
                    if (hasPreference) {
                        metPreferences[index]++;
                    }
                }
            });
        });
    });

    // Display preference summary by priority
    const preferenceLabels = ['1e', '2e', '3e'];
    preferenceLabels.forEach((label, index) => {
        if (totalPreferences[index] > 0) {
            const percentage = Math.round((metPreferences[index] / totalPreferences[index]) * 100);
            const li = document.createElement('li');
            li.innerHTML = `
                <svg class="status-icon ${percentage === 100 ? 'status-success' : 'status-warning'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                ${metPreferences[index]} van de ${totalPreferences[index]} ${label} voorkeuren zijn ingewilligd (${percentage}%)
            `;
            preferenceList.appendChild(li);
        }
    });

    // Find students with no preferences met
    const studentsWithNoPreferencesMet = [];
    result.groups.forEach((group, groupIndex) => {
        group.forEach(student => {
            if (student.preferences.some(p => p)) { // Only check students who have preferences
                const hasAnyPreferenceMet = student.preferences.some(preference => 
                    preference && group.some(s => s.name === preference)
                );
                if (!hasAnyPreferenceMet) {
                    studentsWithNoPreferencesMet.push({
                        name: student.name,
                        group: groupIndex + 1,
                        preferences: student.preferences.filter(p => p)
                    });
                }
            }
        });
    });

    if (studentsWithNoPreferencesMet.length > 0) {
        const li = document.createElement('li');
        li.innerHTML = `
            <svg class="status-icon status-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            ${studentsWithNoPreferencesMet.length} student${studentsWithNoPreferencesMet.length === 1 ? '' : 'en'} heeft/hebben geen enkele voorkeur ingewilligd gekregen:
        `;
        preferenceList.appendChild(li);

        const detailsList = document.createElement('ul');
        detailsList.className = 'summary-list';
        detailsList.style.marginLeft = '20px';
        detailsList.style.marginTop = '8px';

        studentsWithNoPreferencesMet.forEach(student => {
            const currentGroup = result.groups[student.group - 1];
            const groupMembers = currentGroup
                .filter(s => s.name !== student.name)
                .map(s => s.name)
                .join(', ');

            const detailLi = document.createElement('li');
            detailLi.innerHTML = `
                <span style="color: #4a5568;">
                    ${student.name} (Groep ${student.group}): 
                    ${student.preferences.length > 0 ? 
                        `wilde bij ${student.preferences.join(', ')}` : 
                        'had geen voorkeuren'}
                    en zit nu bij: ${groupMembers}
                </span>
            `;
            detailsList.appendChild(detailLi);
        });

        preferenceList.appendChild(detailsList);
    }

    if (totalPreferences.every(total => total === 0)) {
        const li = document.createElement('li');
        li.innerHTML = `
            <svg class="status-icon status-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Geen voorkeuren opgegeven
        `;
        preferenceList.appendChild(li);
    }
    preferenceSummary.appendChild(preferenceList);
    summary.appendChild(preferenceSummary);
    
    container.appendChild(summary);
    
    const groupsContainer = document.createElement('div');
    groupsContainer.className = 'group-container';
    
    result.groups.forEach((group, index) => {
        const groupElement = document.createElement('div');
        groupElement.className = 'group';
        
        const title = document.createElement('h3');
        title.textContent = `Groep ${index + 1}`;
        
        const list = document.createElement('ul');
        group.forEach(student => {
            const item = document.createElement('li');
            item.textContent = student.name;
            list.appendChild(item);
        });
        
        groupElement.appendChild(title);
        groupElement.appendChild(list);
        groupsContainer.appendChild(groupElement);
    });
    
    container.appendChild(groupsContainer);
}

// Calculate and display groups
function calculateGroups() {
    if (students.length === 0) {
        alert('Voeg eerst studenten toe');
        return;
    }
    
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block';
    
    setTimeout(() => {
        const result = findOptimalGroups(students);
        displayResults(result);
        loadingMessage.style.display = 'none';
    }, 100);
}

// Generate Excel template
function generateExcelTemplate() {
    if (students.length === 0) {
        alert('Er zijn nog geen studenten toegevoegd');
        return;
    }
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(students.map(student => ({
        'Naam': student.name,
        'Voorkeur 1': student.preferences[0] || '',
        'Voorkeur 2': student.preferences[1] || '',
        'Voorkeur 3': student.preferences[2] || '',
        'Restrictie 1': student.restrictions[0] || '',
        'Restrictie 2': student.restrictions[1] || '',
        'Restrictie 3': student.restrictions[2] || ''
    })));
    
    XLSX.utils.book_append_sheet(wb, ws, 'Studenten');
    XLSX.writeFile(wb, 'Klassenindeling_Export.xlsx');
}

// Load data from Excel file
function loadExcelFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            students = jsonData.map(row => ({
                name: row.Naam || '',
                preferences: [
                    row['Voorkeur 1'] || '',
                    row['Voorkeur 2'] || '',
                    row['Voorkeur 3'] || ''
                ],
                restrictions: [
                    row['Restrictie 1'] || '',
                    row['Restrictie 2'] || '',
                    row['Restrictie 3'] || ''
                ]
            }));

            // Update file status
            const fileStatus = document.getElementById('fileStatus');
            if (fileStatus) {
                fileStatus.textContent = `${students.length} studenten geladen uit ${file.name}`;
                fileStatus.classList.add('visible');
            }

            // Alleen de studentenlijst bijwerken als we niet op de Excel pagina zijn
            if (!window.location.pathname.includes('excel.html')) {
                updateStudentList();
            }
        } catch (error) {
            console.error('Error loading Excel file:', error);
            alert('Er is een fout opgetreden bij het laden van het Excel bestand.');
        }
    };
    reader.readAsArrayBuffer(file);
} 