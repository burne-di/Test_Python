// AI Assistant with Gemini
class AIAssistant {
    constructor() {
        this.apiKey = null;
        this.conversationHistory = [];
        this.isEnabled = false;
        this.loadAPIKey();
    }

    loadAPIKey() {
        // Load API key from localStorage
        this.apiKey = localStorage.getItem('gemini_api_key');
        this.isEnabled = !!this.apiKey;
    }

    saveAPIKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
        this.isEnabled = true;
    }

    removeAPIKey() {
        this.apiKey = null;
        localStorage.removeItem('gemini_api_key');
        this.isEnabled = false;
        this.conversationHistory = [];
    }

    async sendMessage(userMessage, context = {}) {
        if (!this.isEnabled || !this.apiKey) {
            throw new Error('API key no configurada. Ve a Configuración para agregar tu Gemini API key.');
        }

        try {
            // Build context for AI
            const systemPrompt = this.buildSystemPrompt(context);

            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Call Gemini API
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: systemPrompt }]
                            },
                            ...this.conversationHistory
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2048,
                        }
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Error al comunicarse con Gemini API');
            }

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            // Add AI response to history
            this.conversationHistory.push({
                role: 'model',
                parts: [{ text: aiResponse }]
            });

            return aiResponse;

        } catch (error) {
            console.error('AI Assistant Error:', error);
            throw error;
        }
    }

    buildSystemPrompt(context) {
        const { exercise, userCode, error, testResults } = context;

        let prompt = `Eres un asistente de programación especializado en Data Engineering para ejercicios de práctica.

CONTEXTO DEL EJERCICIO:
Título: ${exercise?.title || 'N/A'}
Categoría: ${exercise?.category || 'N/A'}
Dificultad: ${exercise?.difficulty || 'N/A'}

Descripción: ${exercise?.description || 'N/A'}

Instrucciones:
${exercise?.instructions || 'N/A'}
`;

        if (userCode) {
            prompt += `\n\nCÓDIGO ACTUAL DEL USUARIO:\n\`\`\`${exercise?.category || 'python'}\n${userCode}\n\`\`\``;
        }

        if (error) {
            prompt += `\n\nERROR ENCONTRADO:\n${error}`;
        }

        if (testResults) {
            prompt += `\n\nRESULTADOS DE TEST:\n${JSON.stringify(testResults, null, 2)}`;
        }

        prompt += `\n\nREGLAS:
1. Da respuestas concisas y específicas
2. NO des la solución completa, solo hints y explicaciones
3. Si hay error, explica QUÉ está mal y POR QUÉ
4. Sugiere documentación relevante cuando sea apropiado
5. Usa ejemplos simples para ilustrar conceptos
6. Si el usuario pregunta "dame la solución", responde con hints más específicos pero NO el código completo
7. Fomenta el aprendizaje, no copies y pegues
8. Si sugieres código de ejemplo, usa bloques de código con triple backtick y el lenguaje

FORMATO DE RESPUESTA:
- Para código inline: usa \`código\`
- Para bloques de código multilínea: usa triple backticks
  Ejemplo:
  \`\`\`python
  def ejemplo():
      return "código aquí"
  \`\`\`
- Para código SQL usa \`\`\`sql
- Para listas usa bullet points con guión (-)
- Usa **negrita** para enfatizar conceptos importantes
- Sé amigable y motivador`;

        return prompt;
    }

    clearHistory() {
        this.conversationHistory = [];
    }

    getQuickHint(context) {
        const hints = [
            "💡 Lee cuidadosamente el mensaje de error - te dice exactamente qué está mal",
            "🔍 Revisa la sintaxis de la función que estás usando",
            "📚 Consulta la tab de 'Teoría' para recordar los conceptos",
            "🎯 Asegúrate de que los nombres de variables coincidan",
            "⚡ Verifica que estés usando los parámetros correctos",
            "🧪 Prueba tu código con un ejemplo simple primero",
            "📊 Imprime valores intermedios para debuggear: print(variable)",
            "🔧 Usa type() para verificar el tipo de datos: print(type(variable))"
        ];

        return hints[Math.floor(Math.random() * hints.length)];
    }
}

// Initialize global assistant
const aiAssistant = new AIAssistant();
