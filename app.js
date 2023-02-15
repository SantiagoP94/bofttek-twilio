const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const TwilioProvider = require('@bot-whatsapp/provider/twilio')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

/******************************************************************************************************** */
/**
 *  INICIO FLUJO GRACIAS
 */
const flowGracias = addKeyword(['gracias', 'grac','No, Muchas gracias.']).addAnswer(
    [
        'Ha sido un placer Servirte.',
        'Bofftek te desea un feliz dia, recuerda que puedes comunicarte con nostros en cualquier momento.',
    ]
    )
/**
 *  FIN FLUJO GRACIAS
 */
/**
 *  INICIO FLUJO GRACIAS
 */
const flowReset = addKeyword(['otro requerimiento']).addAnswer(['Está seguro de enviar otro requierimiento?'],{
    buttons:[
        {
            body: 'Si'  
        },
        {
            body: 'No, Muchas gracias.'
        }
    ]

    
})
// /**
//  *  FIN FLUJO GRACIAS
//  */
/******************************************************************************************************** */

//////////////////////////////////////**AQUI INICIA RECOLECCION DE INFORMACION PARA REQUEST De impresoras *///////////////////////////
let NOMBRE;
let CORREO;
let USUARIO;
let UBICACION;

 
//////////////////////////////////////CONFIRMAR INFO TICKET /////////////
const FLOWCONFTICKET1 = addKeyword([]).addAnswer(
    [`Tu ticket fue creado exitosamente, tu codigo generado fue *GSTI-1577*,con ID, puedes darle seguimiento a tu solicitud. ¿Hay algo mas en lo que te pueda ayudar?`],
    {capture:true,buttons:[
            {
                body: 'otro requerimiento'
            },
            {
                body: 'No, Muchas gracias.'
            }
            
        ]
    },
    null,
    [flowGracias,flowReset]
    )
    
const FLOWCONFTICKET2 = addKeyword([]).addAnswer(
   [`Tu ticket fue creado exitosamente, tu codigo generado fue *GSTI-1579*,con ID, puedes darle seguimiento a tu solicitud. ¿Hay algo mas en lo que te pueda ayudar?`],
    {capture:true,buttons:[
            {
                body: 'volver al inicio'
            },
            {
                body: 'No, Muchas gracias.'
            }
            
        ]
    },
    null,
    [flowGracias,flowReset]
    )


//////////////////////////////////////OBTENER UBICACION /////////////
const FLOWGETUBICACION = addKeyword([USUARIO]).addAnswer(
    ['Por favor escribe tu ubicación'],
    {capture:true},
    async ctx => {
        UBICACION = ctx.body
        console.log(UBICACION)
    },
    [FLOWCONFTICKET1]
    )
//////////////////////////////////////OBTENER USUARIO/////////////
const FLOWGETUSER = addKeyword(['Si, Generar ticket']).addAnswer(
    ['Por favor digita tu Usuario'],
    {capture:true},
    async ctx => {
        USUARIO = ctx.body
        console.log(USUARIO)
    },
    [FLOWGETUBICACION]
    )
//////////////////////////////////////OBTENER CORREO ELECTRONICO/////////////
const FLOWGETEMAIL = addKeyword([NOMBRE]).addAnswer(
    ['Por favor digita tu Correo Electronico'],
    {capture:true},
    async ctx => {
        CORREO = ctx.body
        console.log(CORREO)    
    },
    [FLOWCONFTICKET2]
    )
//////////////////////////////////////OBTENER NOMBRE COMPLETO////////////////
const FLOWGETNAME = addKeyword(['Si, Generar ticket']).addAnswer(
    ['Por favor digita tu nombre completo'],
    {capture:true},
    async ctx => {
        NOMBRE = ctx.body
        console.log(NOMBRE)
    },
    [FLOWGETEMAIL]
    )

/**AQUI INICIA FLUJO IMPRESORA */
const flow2_1impresoras = addKeyword(['1','falta de papel']).addAnswer(
    ['Contacte a la secretaria para solicitar suministro de papel, en caso de no recibir respuesta,¿Desea generar un ticket para dar solucion a este inconveniente?'],
    {
        buttons:[
            {
                body:'volver al inicio'
            },
            {
                body:'Si, Generar ticket'
            }
        ]
    },
    null,
    [FLOWGETUSER]
    )
const flow2_2impresoras = addKeyword(['2','toner','Falta de toner']).addAnswer(
    ['¿Desea generar un ticket para dar solucion a este inconveniente?'],
    {
        buttons:[
            {
                body:'volver al inicio'
            },
            {
                body:'Si, Generar ticket'
            }
        ]
    },
    null,
    [FLOWGETNAME]
    )
const flow2_3impresoras = addKeyword(['3','atasco','Atasco']).addAnswer(
    ['Siga instrucciones de la impresora para resolver atasco, en caso de no ser solucionado,¿Desea generar un ticket para dar solucion a este inconveniente?'],
    {
        buttons:[
            {
                body:'volver al inicio'
            },
            {
                body:'Si, Generar ticket'
            }
        ]
    },
    null,
    [FLOWGETNAME]
    )
const flow2_4impresoras = addKeyword(['4','otras fallas','Otras fallas impresoras']).addAnswer(
    ['¿Desea generar un ticket para dar solucion a este inconveniente?'],
    {
        buttons:[
            {
                body:'volver al inicio'
            },
            {
                body:'Si, Generar ticket'
            }
        ]
    },
    null,
    [FLOWGETUSER]
    )
const flow1impresoras = addKeyword(['1', 'No instalada']).addAnswer(
    ['¿Desea generar un ticket para dar solucion a este inconveniente?'],
    {
        buttons:[
            {
                body:'volver al inicio'
            },
            {
                body:'Si, Generar ticket'
            }
            

        ]
    },
    null,
    [FLOWGETNAME]
    )
const flow2impresoras = addKeyword(['2', 'Impresora con problemas','problemas impresora']).addAnswer(
    [
        'Selecciona una de las siguientes opciones: ',
    ],
    {
        capture:true,
        buttons:[
            {
                body:'Falta de papel'
            },
            {
                body:'Falta de toner'
            },
            {
                body:'Atasco'
            },
            {
                body:'Otras fallas impresoras'
            },
            {
                body:'volver al inicio'
            }
        ]
    },
    null,
    [flow2_1impresoras, flow2_2impresoras, flow2_3impresoras,flow2_4impresoras]
    )
const flow3impresoras = addKeyword(['3', 'Usuario Print Viajero (Papercut)','Papercut']).addAnswer(
    ['¿Desea generar un ticket para dar solucion a este inconveniente?'],
    {
        buttons:[
            {
                body:'volver al inicio'
            },
            {
                body:'Si, Generar ticket'
            }
        ]
    },
    null,
    [FLOWGETUSER]
    )
const flowImpresoras = addKeyword(['1', 'impresora', 'impresoras','1. Impresoras','uno','atras']).addAnswer(
    [
        'Por favor seleccione una opción: '
    ],
    {
        buttons:[
            {
                body: 'No instalada'
            },
            {
                body: 'Impresora con problemas'
            },
            {
                body: 'Papercut'
            },
        ],
        capture:true
    },
    null,
    [flow1impresoras,flow2impresoras,flow3impresoras]
    )
/**AQUI FINALIZA FLUJO IMPRESORA */

/******************************************************************************************************** */

/**AQUI INICIA FLUJO GOOGLE DRIVE */
const flow1GoogleDrive = addKeyword(['password', 'reset','1']).addAnswer(
    ['Recuerde que el usuario de Google Drive es el mismo de Correo',
    'Si esto no funcionó por favor enviar ubicación y usuario para generar ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
    )
const flow2GoogleDrive = addKeyword(['unidad', 'unidad G:','2','No aparece unidad g']).addAnswer(
    ['Busque la app de Google Drive en el inicio o la barra de tareas y ejecutela',
    'Si esto no funcionó por favor enviar ubicación y usuario para generar ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
    )    
const flow3GoogleDrive = addKeyword(['3', 'carpeta compartida','carpeta','compartida']).addAnswer(
    ['Recuerde que cada carpeta tiene su dueño',
    'y es quien debe autorizar el acceso',
    'Si esto no funciono, por favor enviar usuario y carpeta para generar ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
    )
const flowGoogleDrive = addKeyword(['2', 'google','google drive','drive','2. Google Drive']).addAnswer(
    [
        'Selecciona una de las siguientes opciones: ',
    ],
    {
        buttons:[
            {
                body: 'Reset Password'
            },
            {
                body: 'No aparece unidad G:'
            },
            {
                body: 'Acceso a carpeta compartida'
            },
            {
                body: 'volver al inicio'
            }
        ]
    },
    null,
    [flow1GoogleDrive,flow2GoogleDrive,flow3GoogleDrive]
    )
/**AQUI FINALIZA FLUJO GOOGLE DRIVE */

/******************************************************************************************************** */

/**AQUI INICIA FLUJO PASSWORD */
const flow1windows = addKeyword(['1', 'windows','cuenta windows']).addAnswer(
    [
        'Enviar usuario para generar ticket',
        'O presiona atras para volver al menú anterior'
    ],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
    )
const flow2correo = addKeyword(['2', 'correo','correo electronico']).addAnswer(
    [
        'Enviar usuario para generar ticket',
        'O presiona atras para volver al menú anterior'
    ],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
    )
const flow3sap = addKeyword(['3', 'sap','cuenta sap']).addAnswer(
    [
        'Ya intentaste recuperar la cuenta a través del cliente SAP?',
        'Sino funciono. Enviar usuario SAP y ambiente para generar ticket',
        'O presiona atras para volver al menú anterior'
    ],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
    )
const flow4vpn = addKeyword(['4', 'vpn','cuenta vpn']).addAnswer(
    [
        'Recuerde que el usuario VPN corresponde al usuario Windows',
        'y no al del correo por lo tanto no debe ser ingresado el dominio de correo',
        'Si esto no funciono. Enviar usuario VPN(Windows) para generar ticket'
    ],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
    )
const flowPassword = addKeyword(['3', 'password','password cuentas','3. Password Cuentas']).addAnswer(
    [
        'Con que cuenta presentas problemas:'
    ],
    {
        buttons:[
            {
                body:'Cuenta Windows'
            },
            {
                body:'Cuenta Correo Electrónico'
            },
            {
                body:'Cuenta SAP'
            },
            {
                body:'Cuenta VPN'
            },
            {
                body:'volver al inicio'
            }
        ],
        capture:true
    },
    async (ctx,{fallback})=>{
        if (ctx.body.includes('atras')){
            return fallback()
        }
    },
    [flow1windows,flow2correo,flow3sap,flow4vpn]
    )
/**AQUI FINALIZA FLUJO PASSWORD */


/**AQUI INICIA FLUJO SOFTWARE */
const flow1Thinkcell = addKeyword(['1','thinkcell','thinkcell','think']).addAnswer(
    ['La licencia de Thinkcell tiene un Valor de USD 240 anual',
        'Si deseas la licencia por favor enviar',
        'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'
    ],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
)
const flow2SmartSheet = addKeyword(['2','smartsheet','SmartSheet']).addAnswer(
    ['Licencia de Smartsheet tiene un Valor de USD 300 anual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
)
const flow3AutoCAD = addKeyword(['3','autocad','AutoCAD']).addAnswer(
    ['Licencia de Autocad tiene un Valor de USD 700 anual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
)
const flow4Acrobat = addKeyword(['4','acrobat','Acrobat']).addAnswer(
    ['Licencia de Acrobat tiene un Valor de USD 260 anual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
)
const flow5Photoshop = addKeyword(['5','Photoshop','photoshop']).addAnswer(
    ['Licencia de Photoshop tiene un Valor de USD 600 anual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
)
const flow6Visio = addKeyword(['6','visio','Visio']).addAnswer(
    ['Licencia de Visio tiene un Valor de USD 46,7 mensual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
)
const flow7Project = addKeyword(['7','project','Project']).addAnswer(
    ['La Licencia de Project tiene un Valor de USD 46,7 mensual',
        'Si deseas la licencia por favor enviar',
        'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'
    ],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
)
const flow8Apps = addKeyword(['8','otras aplicaciones','Apps']).addAnswer(
    ['Por favor regalame nombre de Aplicación y usuario para poder generar ticket'],
    {
        buttons:[
            {
                body:'volver al inicio'
            }
        ]
    },
    null
)
const flowSoftware = addKeyword(['4','software','solicitud software','4. Solicitud Software']).addAnswer(
    [
        'Selecciona tú licencia: '
    ],
    {
        buttons:[
            {
                body:'thinkcell'
            },
            {
                body:'smartsheet'
            },
            {
                body:'autocad'
            },
            {
                body:'acrobat'
            },
            {
                body:'photoshop'
            },
            {
                body:'visio'
            },
            {
                body:'project'
            },
            {
                body:'otras aplicaciones'
            },
            {
                body: 'volver al inicio'
            }
        ]
    },
    null,
    [flow1Thinkcell, flow2SmartSheet, flow3AutoCAD, flow4Acrobat, flow5Photoshop, flow6Visio, flow7Project,flow8Apps ]
)
/**AQUI FINALIZA FLUJO SOFTWARE */

flowPrincipal = addKeyword(['Buenas noches','Buen dia','buenas tardes','buena tarde','ola','hola','Hola como estas?','volver al inicio','Si']).addAnswer(
        [
            '🙌 Hola bienvenido a *Bofttek*',
            'Estamos para ayudarte con tu inconveniente',
            'por favor indicanos la categoria de tú problema: ',
        ],
        {
            buttons:[
                {
                    body: 'Impresoras'
                },
                {
                    body: 'Google Drive'
                },
                {
                    body: 'Password Cuentas'
                },
                {
                    body: 'Solicitud Software'
                }
            ]
        },
        null,
        [flowImpresoras, flowGoogleDrive, flowPassword, flowSoftware,flowGracias]
        )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])

    const adapterProvider = createProvider(TwilioProvider, {
        accountSid: 'AC3ea712f40bf13ff2cbc664c9f90d7644',
        authToken: '65aab035b05e18170220d5dac27ae621',
        vendorNumber: '+14155238886',
    })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}

main()
