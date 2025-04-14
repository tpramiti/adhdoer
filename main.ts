import { App, Editor, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface ADHDoerSettings {
	openaiApiKey: string;
	temperature: number;
}

const DEFAULT_SETTINGS: ADHDoerSettings = {
	openaiApiKey: '',
	temperature: 0.3
}

export default class ADHDoerPlugin extends Plugin {
	settings: ADHDoerSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('bot', 'ADHDoer Assistant', () => {
			new Notice('ADHDoer is active!');
		});

		this.addCommand({
			id: 'send-selection-to-openai',
			name: 'Ask Assistant (ADHDoer)',
			editorCallback: async (editor: Editor) => {
				const selectedText = editor.getSelection();
				if (!selectedText) {
					new Notice("Please select some text first.");
					return;
				}

				const prompt = `Please respond helpfully to the following input:\n\n${selectedText}`;
				const response = await this.callOpenAI(prompt);

				if (response) {
					editor.replaceSelection(`${selectedText}\n\n**Assistant Response:**\n${response}`);
				}
			}
		});

		this.addSettingTab(new ADHDoerSettingTab(this.app, this));
	}

	async callOpenAI(prompt: string): Promise<string | null> {
		const apiKey = this.settings.openaiApiKey;

		if (!apiKey) {
			new Notice("No API key set in settings.");
			return null;
		}

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "gpt-4o-mini",
				messages: [
					{
						role: "system",
						content: "You are a helpful assistant designed to support users with ADHD. Be clear, concise, and friendly. Follow instructions exactly."
					},
					{
						role: "user",
						content: prompt
					}
				],
				temperature: this.settings.temperature,
				max_tokens: 300
			})
		});

		if (!response.ok) {
			new Notice(`OpenAI error: ${response.status}`);
			return null;
		}

		const data = await response.json();
		return data.choices?.[0]?.message?.content?.trim() || "No response.";
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ADHDoerSettingTab extends PluginSettingTab {
	plugin: ADHDoerPlugin;

	constructor(app: App, plugin: ADHDoerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
	
		// OpenAI API Key input
		new Setting(containerEl)
			.setName('OpenAI API Key')
			.setDesc('Paste your OpenAI API key here')
			.addText(text => text
				.setPlaceholder('sk-...')
				.setValue(this.plugin.settings.openaiApiKey)
				.onChange(async (value) => {
					this.plugin.settings.openaiApiKey = value;
					await this.plugin.saveSettings();
				}));
	
		// Temperature slider
		new Setting(containerEl)
			.setName('Response Creativity (Temperature)')
			.setDesc('0 = Precise and focused, 1 = Creative and varied')
			.addSlider(slider => slider
				.setLimits(0, 1, 0.1)
				.setValue(this.plugin.settings.temperature)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.temperature = value;
					await this.plugin.saveSettings();
				}));
	}
	
}

