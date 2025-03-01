.586
.model flat, stdcall
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;includem biblioteci, si declaram ce functii vrem sa importam
includelib msvcrt.lib
extern exit: proc
extern malloc: proc
extern memset: proc
extern printf:proc

includelib canvas.lib
extern BeginDrawing: proc
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;declaram simbolul start ca public - de acolo incepe executia
public start
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;sectiunile programului, date, respectiv cod
.data
;aici declaram date
window_title DB "Exemplu proiect desenare",0
area_width EQU 660
area_height EQU 660
area DD 0
game_area DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		  DD 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

i DD 0
j DD 0
nr_vaporase DD 0
c1 DD 0
c2 DD 0
c3 DD 0
c4 DD 0
dim_matrice equ 10
x_inceput DD 0
y_inceput DD 0
counter DD 0 ; numara evenimentele de tip timer

arg1 EQU 8
arg2 EQU 12
arg3 EQU 16
arg4 EQU 20

format DB "%d",13,10,0

symbol_width EQU 10
symbol_height EQU 20

nr_coloane equ 10
nr_linii equ 10

dim_patrat equ 60

	;(60-20)/2 = (dim_patrat - symbol_height) / 2 ;20
	;(60-10)/2 = (dim_patrat - symbol_width) / 2  ;25	
litere DD 'A' , 'B' , 'C', 'D' ,'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' 
cifre DD  '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9'
include digits.inc
include letters.inc

.code
; procedura make_text afiseaza o litera sau o cifra la coordonatele date
; arg1 - simbolul de afisat (litera sau cifra)
; arg2 - pointer la vectorul de pixeli
; arg3 - pos_x
; arg4 - pos_y
make_text proc
	push ebp
	mov ebp, esp
	pusha
	
	mov eax, [ebp+arg1] ; citim simbolul de afisat
	cmp eax, 'A'
	jl make_digit
	cmp eax, 'Z'
	jg make_digit
	sub eax, 'A'
	lea esi, letters
	jmp draw_text
make_digit:
	cmp eax, '0'
	jl make_space
	cmp eax, '9'
	jg make_space
	sub eax, '0'
	lea esi, digits
	jmp draw_text
make_space:	
	mov eax, 26 ; de la 0 pana la 25 sunt litere, 26 e space
	lea esi, letters
	
draw_text:
	mov ebx, symbol_width
	mul ebx
	mov ebx, symbol_height
	mul ebx
	add esi, eax
	mov ecx, symbol_height
bucla_simbol_linii:
	mov edi, [ebp+arg2] ; pointer la matricea de pixeli
	mov eax, [ebp+arg4] ; pointer la coord y
	add eax, symbol_height
	sub eax, ecx				;EAX= Y + SH - ECX ( ECX=SH->1) => EAX= Y -> Y+SH-1
	mov ebx, area_width
	mul ebx
	add eax, [ebp+arg3] ; pointer la coord x
	shl eax, 2 ; inmultim cu 4, avem un DWORD per pixel
	add edi, eax
	push ecx
	mov ecx, symbol_width
bucla_simbol_coloane:
	cmp byte ptr [esi], 0
	je simbol_pixel_alb
	mov dword ptr [edi], 0  		; CULOAREA NEGRU
	jmp simbol_pixel_next
simbol_pixel_alb:
	mov dword ptr [edi], 0FFFFFFh
simbol_pixel_next:
	inc esi
	add edi, 4
	loop bucla_simbol_coloane
	pop ecx
	loop bucla_simbol_linii
	popa
	mov esp, ebp
	pop ebp
	ret
make_text endp

; un macro ca sa apelam mai usor desenarea simbolului
make_text_macro macro symbol, drawArea, x, y
	push y
	push x
	push drawArea
	push symbol
	call make_text
	add esp, 16
endm
line_horizontal macro x, y, len, color
local bucla_linie
	pusha
	mov eax, y ; eax = y
	mov ebx,area_width
	mul ebx ; eax=y * area_width
	add eax, x ; eax = y*area_width + x
	shl eax, 2; eax = ( y*area_width + x)*4
	add eax, area
	mov ecx, len
bucla_linie:
	mov dword ptr[eax], color
	add eax, 4
	loop bucla_linie
	popa
endm

afis macro x
pusha
push x
push offset format
call printf
add esp, 8
popa
endm

line_vertical macro x, y, len, color
local bucla_linie
	pusha
	mov eax, y ; eax = y
	mov ebx,area_width
	mul ebx ; eax=y * area_width
	add eax, x ; eax = y*area_width + x
	shl eax, 2; eax = ( y*area_width + x)*4
	add eax, area
	mov ecx, len
bucla_linie:
	mov dword ptr[eax], color
	add eax, area_width*4
	loop bucla_linie
	popa
endm
line_diagonal_left macro x, y, len, color                  ;linie pe diagonala dreapta jos
local bucla_linie
	pusha
	mov eax, y ; eax = y
	mov ebx,area_width
	mul ebx ; eax=y * area_width
	add eax, x ; eax = y*area_width + x
	shl eax, 2; eax = ( y*area_width + x)*4
	add eax, area
	mov ecx, len
bucla_linie:
	mov dword ptr[eax], color
	add eax, (area_width-1)*4
	loop bucla_linie
	popa
endm

line_diagonal_right macro x, y, len, color                 ;linie pe diagonala dreapta jos
local bucla_linie
	pusha
	mov eax, y ; eax = y
	mov ebx,area_width
	mul ebx ; eax=y * area_width
	add eax, x ; eax = y*area_width + x
	shl eax, 2; eax = ( y*area_width + x)*4
	add eax, area
	mov ecx, len
bucla_linie:
	mov dword ptr[eax], color
	add eax, (area_width+1)*4
	loop bucla_linie
	popa
endm

colorare_patrat macro x, y, len, color
local bucla_colorare
	pusha
	mov edi,y
	mov esi, 0
bucla_colorare:
	line_horizontal x,edi, len-1, color
	inc esi
	inc edi
	cmp esi,len-1
	jne bucla_colorare
	popa
endm

calcul_i_si_j macro x,y

	mov esi,0				;si=i
	mov edi,0				;di=j
	mov edx,0
	mov eax, y
	mov ebx, dim_patrat
	div ebx
	mov si, ax
	mov i, esi
	dec i
	mov edx,0
	mov eax, x
	div ebx
	mov di,ax
	mov j,edi
	dec j

endm

calcul_y_si_x macro m,n
	mov eax, m								;y_inceput=dim_patrat*m+1  		m=i
	inc eax
	mov ecx,dim_patrat
	mul	ecx									;x_inceput=dim_patrat*n+1		n=j
	inc eax
	mov y_inceput, eax
	mov eax,n
	inc eax
	mul ecx
	inc eax
	mov x_inceput, eax
endm

;colorare un anumit patratel in functie de valoarea din matricea de joc		if( game_area[i][j]==1) colorare rosu
																					;else colorare albastru
verif_patrat macro a, b
local rosu,aici,evita,verde,galben,albastru
	pusha	
	mov eax, a
	mov ebx, b
	cmp ebx,0
	jl evita
	cmp eax,0
	jl evita														;daca se afla in afara matricii de joc nu se coloreaza nimic
	mov edi, 0							
	mov eax, a
	mov ebx,dim_matrice
	mul ebx
	add eax,b
	mov edi,eax
	shl edi,2														;verific daca culoarea patratelului este rosie sau albastra
	cmp game_area[edi],4
	je albastru
	cmp game_area[edi],3
	je galben
	cmp game_area[edi],2
	je verde
	cmp game_area[edi],1
	je rosu
	calcul_y_si_x a,b
	colorare_patrat x_inceput, y_inceput,dim_patrat,0cb42f5h
	jmp aici
	rosu:
	calcul_y_si_x a,b
	colorare_patrat x_inceput, y_inceput,dim_patrat, 0D81313h
	jmp aici
	verde:
	calcul_y_si_x a,b
	colorare_patrat x_inceput, y_inceput,dim_patrat, 013D87Ah
	jmp aici
	galben:
	calcul_y_si_x a,b
	colorare_patrat x_inceput, y_inceput,dim_patrat, 013D818h
	jmp aici
	albastru:
	calcul_y_si_x a,b
	colorare_patrat x_inceput, y_inceput,dim_patrat, 00000FFh
	aici:
	evita:   																
	popa													
endm		



randomizare macro k
rdtsc
	mov ecx,10
	mov edx,0
	div ecx
	mov k,edx
endm

randomizare_linie macro i,j,dim							
local reia,big_j, not_good
	mov edi,0
	mov esi,dim
	mov ecx,0
	mov ebx,j
	add ebx,dim
	cmp ebx,dim_matrice
	jge big_j
	
	mov eax,i
	mov ebx,dim_matrice
	mul ebx
	add eax,j
	mov edi,eax
	shl edi,2																;edi=(i*dim_matrice+j)*4
	mov eax,nr_vaporase
	add eax,dim
	mov eax,nr_vaporase
	add eax,dim
	mov nr_vaporase,eax
	reia:
	cmp game_area[edi],0
	jg not_good
	mov game_area[edi],dim												
	add edi,4
	inc ecx
	cmp ecx,esi
	jne reia
	inc c1
	not_good:
	inc c3
	big_j:
	
endm
randomizare_coloana macro i,j,dim							
local reia,big_i,not_good	
	mov edi,0
	mov esi,dim
	mov ecx,0
	mov ebx,i
	add ebx,dim
	cmp ebx,dim_matrice
	jge big_i
	
	mov eax,i
	mov ebx,dim_matrice
	mul ebx
	add eax,j
	mov edi,eax
	shl edi,2																;edi=(i*dim_matrice+j)*4
	mov eax,nr_vaporase
	add eax,dim
	mov nr_vaporase,eax
	reia:
	cmp game_area[edi],0
	jg not_good
	mov game_area[edi],dim
	mov edx,dim_matrice
	shl edx,2
	add edi,edx
	inc ecx
	cmp ecx,esi
	jne reia
	inc c2
	not_good:
	inc c4
	big_i:

endm
; functia de desenare - se apeleaza la fiecare click
; sau la fiecare interval de 200ms in care nu s-a dat click
; arg1 - evt (0 - initializare, 1 - click, 2 - s-a scurs intervalul fara click)
; arg2 - x
; arg3 - y
draw proc
	push ebp
	mov ebp, esp
	pusha
	
	mov eax, [ebp+arg1]
	cmp eax, 1
	jz evt_click
	cmp eax, 2
	jz evt_timer ; nu s-a efectuat click pe nimic
	;mai jos e codul care intializeaza fereastra cu pixeli albi
	mov eax, area_width
	mov ebx, area_height
	mul ebx
	shl eax, 2
	push eax
	push 255
	push area
	call memset
	add esp, 12
	jmp afisare_litere
	
evt_click:
	; line_diagonal_right [ebp+arg2], [ebp+arg3],60, 0FFh
	; line_diagonal_left  [ebp+arg2], [ebp+arg3],60, 0FFh
	calcul_i_si_j [ebp+arg2], [ebp+arg3] 
	verif_patrat i,j
evt_timer:
	inc counter
	
afisare_litere:
	;afisam valoarea counter-ului curent (sute, zeci si unitati)
	mov ebx, 10
	mov eax, counter
	;cifra unitatilor
	mov edx, 0
	div ebx
	add edx, '0'
	make_text_macro edx, area, 30, 10
	;cifra zecilor
	mov edx, 0
	div ebx
	add edx, '0'
	make_text_macro edx, area, 20, 10
	;cifra sutelor
	mov edx, 0
	div ebx
	add edx, '0'
	make_text_macro edx, area, 10, 10
	
	mov edi,0
	mov esi, dim_patrat
bucla_linii:
	line_horizontal 0, esi , area_width, 0
	add esi, dim_patrat
	inc edi
 	cmp	edi,nr_linii
	jne bucla_linii	
	
	mov edi,0
	mov esi, dim_patrat
bucla_coloane:
	line_vertical esi, 0, area_height, 0
	add esi, dim_patrat
	inc edi
	cmp edi,nr_coloane
	jne bucla_coloane
	
	mov edi,0
	mov esi, dim_patrat+(dim_patrat - symbol_width) / 2
bucla_litere:
	make_text_macro litere[edi*4], area, esi, (dim_patrat - symbol_height) / 2				;(dim_patrat - symbol_height) / 2
	add esi,dim_patrat
	inc edi
	cmp edi,nr_linii
	jne bucla_litere
	
	mov edi,0
	mov esi, dim_patrat+(dim_patrat - symbol_height) / 2
	
bucla_cifre:
	make_text_macro cifre[edi*4], area, (dim_patrat-symbol_width) / 2, esi				;poz_cif=(dim_patrat-symbol_width)/2
	add esi,dim_patrat
	inc edi
	cmp edi,nr_coloane
	jne bucla_cifre
	
	make_text_macro '1', area, (dim_patrat-symbol_height)/2,10* dim_patrat+(dim_patrat-2*symbol_width)/2
	make_text_macro '0', area, (dim_patrat-symbol_height)/2+symbol_width, 10* dim_patrat+(dim_patrat-2*symbol_width)/2
	
	
final_draw:
	popa
	mov esp, ebp
	pop ebp
	ret
draw endp

start:
	;alocam memorie pentru zona de desenat
	mov eax, area_width
	mov ebx, area_height
	mul ebx
	shl eax, 2
	push eax
	call malloc
	add esp, 4
	mov area, eax  			;matricea de pixeli
	
	here:										;randomizare 4 vaporase in linie
	randomizare i
	randomizare j
	randomizare_linie i,j,4
	cmp c3, 1
	jl here
	cmp c1,1
	jl here
	
	
	here2:										;randomizare 4 vaporase in coloana
	randomizare i
	randomizare j
	randomizare_coloana i,j,4
	cmp c4, 1
	jl here2
	cmp c2,1
	jl here2
	
	
	here3:										;randomizare 3 vaporase in linie
	randomizare i
	randomizare j
	randomizare_linie i,j,3
	cmp c3, 2
	jl here3
	cmp c1,2
	jl here3
	
	
	
	here4:										;randomizare 3 vaporase in coloana
	randomizare i
	randomizare j
	randomizare_coloana i,j,3
	cmp c4, 2
	jl here4
	cmp c2,2
	jl here4
	
	
	
	here5:										;randomizare 2 vaporase in linie
	randomizare i
	randomizare j
	randomizare_linie i,j,2
	cmp c3, 3
	jl here5
	cmp c1,3
	jl here5
	
	
	
	here6:										;randomizare 2 vaporase in coloana
	randomizare i
	randomizare j
	randomizare_coloana i,j,2
	cmp c4, 3
	jl here6
	cmp c2,3
	jl here6
	
	here7:										;randomizare 1 vaporas in linie
	randomizare i
	randomizare j
	randomizare_linie i,j,1
	cmp c3, 4
	jl here7
	cmp c1,4
	jl here7
	
	here8:										;randomizare 1 vaporas in coloana
	randomizare i
	randomizare j
	randomizare_coloana i,j,1
	cmp c4, 4
	jl here8
	cmp c2,4
	jl here8
	
	
	
	;apelam functia de desenare a ferestrei
	; typedef void (*DrawFunc)(int evt, int x, int y);
	; void __cdecl BeginDrawing(const char *title, int width, int height, unsigned int *area, DrawFunc draw);
	push offset draw
	push area
	push area_height
	push area_width
	push offset window_title
	call BeginDrawing
	add esp, 20
	
	
	;terminarea programului
	push 0
	call exit
end start
