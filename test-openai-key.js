// Quick test to verify OpenAI API key
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log('\n🔍 Testing OpenAI API Key...\n');
console.log('API Key (first 20 chars):', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');

// Test available models
async function testModels() {
  const modelsToTry = ['gpt-5.2-pro', 'gpt-5.2-codex', 'gpt-4o', 'gpt-3.5-turbo'];
  
  for (const model of modelsToTry) {
    try {
      console.log(`\n Testing model: ${model}...`);
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello in 5 words or less.' }
        ],
        max_tokens: 20
      });
      
      console.log(`✅ ${model} works!`);
      console.log(`   Response: ${completion.choices[0].message.content}`);
      return model; // Return first working model
    } catch (error) {
      console.log(`❌ ${model} failed:`);
      console.log(`   Error: ${error.message}`);
      if (error.code) console.log(`   Code: ${error.code}`);
      if (error.status) console.log(`   Status: ${error.status}`);
    }
  }
  
  console.log('\n❌ All models failed. Check your API key and account status.');
  return null;
}

testModels().then(workingModel => {
  if (workingModel) {
    console.log(`\n✅ SUCCESS! Use model: ${workingModel}`);
  } else {
    console.log('\n⚠️  Please check:');
    console.log('   1. API key is valid and not expired');
    console.log('   2. You have credits/billing set up');
    console.log('   3. You have access to these models');
    console.log('\n   Visit: https://platform.openai.com/account/api-keys');
  }
  process.exit(workingModel ? 0 : 1);
});
