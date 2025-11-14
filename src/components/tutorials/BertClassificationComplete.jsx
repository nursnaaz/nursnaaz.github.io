import { useState, useEffect } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Container from '@cloudscape-design/components/container'
import Box from '@cloudscape-design/components/box'
import Alert from '@cloudscape-design/components/alert'
import Header from '@cloudscape-design/components/header'
import Tabs from '@cloudscape-design/components/tabs'
import Input from '@cloudscape-design/components/input'
import Button from '@cloudscape-design/components/button'
import { CodeBlock } from '../interactive/CodeBlock'
import { StudentNote } from '../interactive/StudentNote'


export function BertClassificationComplete({ onStepChange }) {
  const [activeTabId, setActiveTabId] = useState('overview')
  const [sentimentInput, setSentimentInput] = useState('')
  const [sentimentOutput, setSentimentOutput] = useState('')


  useEffect(() => {
    if (onStepChange) {
      const tabIndex = tabs.findIndex(tab => tab.id === activeTabId)
      onStepChange(tabIndex, tabs.length)
    }
    if (window.MathJax) {
      window.MathJax.typesetPromise?.()
    }
  }, [activeTabId, onStepChange])


  const analyzeSentiment = () => {
    const input = sentimentInput.toLowerCase()
    const positiveWords = ['great', 'amazing', 'fantastic', 'loved', 'brilliant', 'heartwarming', 'incredible', 'engaging', 'awesome', 'excellent']
    const negativeWords = ['terrible', 'boring', 'disappointing', 'bad', 'waste', 'dull', 'poor', 'worst', 'mess']
    
    let sentiment = 'Neutral'
    if (positiveWords.some(word => input.includes(word))) {
      sentiment = 'Positive 😊'
    } else if (negativeWords.some(word => input.includes(word))) {
      sentiment = 'Negative 😞'
    }
    
    setSentimentOutput(`Predicted Sentiment: ${sentiment}`)
  }


  const tabs = [
    {
      id: 'overview',
      label: '🌟 Overview',
      content: <OverviewSection />
    },
    {
      id: 'architecture',
      label: '🏗️ Architecture',
      content: <ArchitectureSection />
    },
    {
      id: 'classification',
      label: '🔍 Classification',
      content: <ClassificationSection 
        sentimentInput={sentimentInput}
        setSentimentInput={setSentimentInput}
        sentimentOutput={sentimentOutput}
        analyzeSentiment={analyzeSentiment}
      />
    },
    {
      id: 'code',
      label: '🚀 Complete Code',
      content: <CompleteCodeSection />
    }
  ]


  return (
    <SpaceBetween size="l">
      <Container>
        <Box fontSize="heading-xl" textAlign="center" padding="l">
          <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
            🤖 BERT for Text Classification
          </Box>
          <Box fontSize="heading-m" color="text-body-secondary" marginTop="s">
            Fine-tune BERT for sentiment analysis with production-ready code
          </Box>
        </Box>
      </Container>


      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        variant="container"
      />
    </SpaceBetween>
  )
}


// Overview Section
function OverviewSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">🌟 What is BERT?</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            BERT (Bidirectional Encoder Representations from Transformers) is a revolutionary NLP model 
            introduced by Google in 2018. Unlike traditional models that process text sequentially, BERT 
            is bidirectional, capturing context from both left and right directions simultaneously. This 
            makes it exceptionally powerful for tasks like text classification, question answering, and more.
          </Box>


          <Box variant="h3">Key Features of BERT:</Box>
          <ul style={{ marginLeft: '20px' }}>
            <li>
              <strong>Bidirectional Context:</strong> Understands words in context by looking at the entire sentence
            </li>
            <li>
              <strong>Pre-training:</strong> Trained on massive datasets (e.g., Wikipedia) using Masked Language 
              Modeling (MLM) and Next Sentence Prediction (NSP)
            </li>
            <li>
              <strong>Fine-tuning:</strong> Adapted to specific tasks like sentiment analysis with minimal 
              additional training
            </li>
          </ul>


          <Alert type="info" header="🔑 Why BERT?">
            BERT's ability to understand nuanced language patterns makes it ideal for tasks requiring deep 
            contextual understanding, such as classifying movie reviews as positive or negative.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Architecture Section
function ArchitectureSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">🏗️ BERT Architecture</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            BERT is built on the Transformer's encoder architecture, stacking multiple layers of 
            interconnected nodes. Each layer includes:
          </Box>


          <ul style={{ marginLeft: '20px' }}>
            <li>
              <strong>Multi-Head Self-Attention:</strong> Computes attention scores to focus on relevant words
            </li>
          </ul>


          <div style={{ 
            background: '#2c3e50', 
            color: '#ecf0f1', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '18px',
            margin: '20px 0'
          }}>
            Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>)V
          </div>


          <Box variant="p">
            Where Q (query), K (key), and V (value) are vectors, and d<sub>k</sub> is the dimension of the keys.
          </Box>


          <ul style={{ marginLeft: '20px' }}>
            <li>
              <strong>Feed-Forward Networks:</strong> Applies dense layers to each token's representation
            </li>
            <li>
              <strong>Layer Normalization:</strong> Stabilizes training by normalizing outputs
            </li>
          </ul>


          <Box variant="h3" marginTop="m">BERT's Special Tokens:</Box>
          <ul style={{ marginLeft: '20px' }}>
            <li>
              <strong>[CLS]:</strong> Added at the start, its output is used for classification tasks
            </li>
            <li>
              <strong>[SEP]:</strong> Separates sentences or marks the end of a sequence
            </li>
          </ul>


          <Alert type="info" header="🔑 BERT's Power">
            The bidirectional nature and pre-training allow BERT to capture deep semantic relationships, 
            making it highly effective for downstream tasks.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Classification Section
function ClassificationSection({ sentimentInput, setSentimentInput, sentimentOutput, analyzeSentiment }) {
  const dataCode = `texts = [
    "This movie is great and I loved it!",
    "Terrible film, very boring.",
    ...
]
labels = [1, 0, ...]
train_texts, val_texts, train_labels, val_labels = train_test_split(
    texts, labels, test_size=0.2, random_state=42
)
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')`


  const modelCode = `bert_model = TFBertModel.from_pretrained('bert-base-uncased')
input_ids = tf.keras.layers.Input(shape=(None,), dtype=tf.int32, name="input_ids")
attention_mask = tf.keras.layers.Input(shape=(None,), dtype=tf.int32, name="attention_mask")
bert_outputs = bert_model(input_ids, attention_mask=attention_mask)
pooled_output = bert_outputs.pooler_output
dropout = tf.keras.layers.Dropout(0.3)(pooled_output)
output = tf.keras.layers.Dense(2, activation='softmax')(dropout)
model = tf.keras.Model(inputs=[input_ids, attention_mask], outputs=output)`


  const trainingCode = `model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=2e-5),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=10,
    verbose=2
)`


  const inferenceCode = `def predict_sentiment(text, model, tokenizer, max_len=128):
    encodings = tokenizer(
        [text],
        max_length=max_len,
        padding='max_length',
        truncation=True,
        return_tensors='tf'
    )
    probs = model({'input_ids': encodings['input_ids'], 'attention_mask': encodings['attention_mask']}).numpy()
    prediction = np.argmax(probs, axis=-1)[0]
    print(f"Probabilities: {probs}")
    return "Positive" if prediction == 1 else "Negative"`


  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">🔍 BERT for Text Classification</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            BERT excels in text classification by leveraging its contextual embeddings. For sentiment 
            analysis, we fine-tune BERT on a labeled dataset of movie reviews labeled as positive or 
            negative. Below is a detailed breakdown of the process:
          </Box>


          {/* Step 1: Data Preparation */}
          <Container header={<Header variant="h3">Step 1: Data Preparation</Header>}>
            <SpaceBetween size="m">
              <Box variant="p">
                The dataset consists of movie reviews with binary labels (1 for positive, 0 for negative). 
                We tokenize the text using BERT's tokenizer, which converts words into subword tokens and 
                adds special tokens like [CLS] and [SEP].
              </Box>


              <CodeBlock code={dataCode} language="python" />


              <Box variant="p">
                The tokenizer outputs <code>input_ids</code> (token indices) and <code>attention_mask</code> 
                (indicating valid tokens vs. padding).
              </Box>
            </SpaceBetween>
          </Container>


          {/* Step 2: Model Architecture */}
          <Container header={<Header variant="h3">Step 2: Model Architecture</Header>}>
            <SpaceBetween size="m">
              <Box variant="p">
                We use the pre-trained <code>bert-base-uncased</code> model and add a classification head. 
                The [CLS] token's output (pooled_output) is passed through a dropout layer and a dense layer 
                with softmax activation for binary classification.
              </Box>


              <CodeBlock code={modelCode} language="python" />


              <Box variant="p">
                The softmax layer outputs probabilities for positive and negative classes.
              </Box>
            </SpaceBetween>
          </Container>


          {/* Step 3: Training */}
          <Container header={<Header variant="h3">Step 3: Training</Header>}>
            <SpaceBetween size="m">
              <Box variant="p">
                The model is fine-tuned with a small learning rate (e.g., 2e-5) using the Adam optimizer 
                and sparse categorical crossentropy loss. We train for 10 epochs on batched data.
              </Box>


              <CodeBlock code={trainingCode} language="python" />


              <Alert type="warning" header="⚠️ Training Tips">
                <SpaceBetween size="s">
                  <Box>
                    <strong>Small Learning Rate:</strong> BERT requires small learning rates (e.g., 2e-5) 
                    to avoid catastrophic forgetting of pre-trained weights.
                  </Box>
                  <Box>
                    <strong>Batch Size:</strong> Small batches (e.g., 2) are used due to BERT's memory demands.
                  </Box>
                  <Box>
                    <strong>Epochs:</strong> 3-10 epochs are often sufficient for fine-tuning on small datasets.
                  </Box>
                </SpaceBetween>
              </Alert>
            </SpaceBetween>
          </Container>


          {/* Step 4: Inference */}
          <Container header={<Header variant="h3">Step 4: Inference</Header>}>
            <SpaceBetween size="m">
              <Box variant="p">
                For inference, we tokenize a new text, pass it through the model, and predict the sentiment 
                based on the highest probability class.
              </Box>


              <CodeBlock code={inferenceCode} language="python" />
            </SpaceBetween>
          </Container>


          {/* Step 5: Interactive Demo */}
          <Container header={<Header variant="h3">Step 5: Interactive Demo</Header>}>
            <SpaceBetween size="m">
              <Box variant="p">
                Test the sentiment analysis model with your own text:
              </Box>


              <div style={{ 
                background: '#f0faff', 
                padding: '25px', 
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <Box fontSize="heading-m" marginBottom="m">🔄 Sentiment Analysis Demo</Box>
                <SpaceBetween size="m">
                  <Input
                    value={sentimentInput}
                    onChange={({ detail }) => setSentimentInput(detail.value)}
                    placeholder="Enter a movie review (e.g., 'This is an awesome movie!')"
                  />
                  <Button variant="primary" onClick={analyzeSentiment}>
                    Analyze Sentiment
                  </Button>
                  {sentimentOutput && (
                    <Box fontSize="heading-s" color="text-status-info">
                      {sentimentOutput}
                    </Box>
                  )}
                </SpaceBetween>
              </div>


              <Box variant="p" fontSize="body-s" color="text-body-secondary">
                Note: This demo uses a simple keyword-based simulation. The actual model uses BERT's 
                contextual understanding for more accurate predictions.
              </Box>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Complete Code Section
function CompleteCodeSection() {
  const completeCode = `import tensorflow as tf
from transformers import TFBertModel, BertTokenizer
from sklearn.model_selection import train_test_split
import numpy as np


# Dataset
texts = [
    "This movie is great and I loved it!",
    "Terrible film, very boring.",
    "Amazing storyline and acting!",
    "I didn't enjoy this at all.",
    "Fantastic experience, highly recommend!",
    "Really bad, waste of time.",
    "One of the best movies I've seen this year!",
    "Completely disappointing and predictable.",
    "Brilliant direction and stunning visuals.",
    "I fell asleep halfway through, so dull.",
    "Heartwarming and beautifully shot.",
    "Poor acting and weak script.",
    "Absolutely loved the plot twists!",
    "Not worth the hype at all.",
    "Engaging from start to finish!",
    "The worst film I've ever watched.",
    "Incredible performances by the cast!",
    "Script was a mess and pacing was off."
]
labels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]


# Train/Val Split
train_texts, val_texts, train_labels, val_labels = train_test_split(
    texts, labels, test_size=0.2, random_state=42
)


# Load tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')


# Tokenization function
def tokenize_texts(texts, max_len=128):
    encodings = tokenizer(
        texts,
        max_length=max_len,
        padding='max_length',
        truncation=True,
        return_tensors='tf'
    )
    return encodings['input_ids'], encodings['attention_mask']


# Tokenize data
train_input_ids, train_attention_mask = tokenize_texts(train_texts)
val_input_ids, val_attention_mask = tokenize_texts(val_texts)


# Convert labels to tensors
train_labels = tf.convert_to_tensor(train_labels, dtype=tf.int32)
val_labels = tf.convert_to_tensor(val_labels, dtype=tf.int32)


# Prepare datasets
train_dataset = tf.data.Dataset.from_tensor_slices((
    {'input_ids': train_input_ids, 'attention_mask': train_attention_mask},
    train_labels
)).batch(2).prefetch(tf.data.AUTOTUNE)


val_dataset = tf.data.Dataset.from_tensor_slices((
    {'input_ids': val_input_ids, 'attention_mask': val_attention_mask},
    val_labels
)).batch(2).prefetch(tf.data.AUTOTUNE)


# Load base BERT model
bert_model = TFBertModel.from_pretrained('bert-base-uncased')


# Input layers
input_ids = tf.keras.layers.Input(shape=(None,), dtype=tf.int32, name="input_ids")
attention_mask = tf.keras.layers.Input(shape=(None,), dtype=tf.int32, name="attention_mask")


# Get pooled output from BERT
bert_outputs = bert_model(input_ids, attention_mask=attention_mask)
pooled_output = bert_outputs.pooler_output


# Classification head
dropout = tf.keras.layers.Dropout(0.3)(pooled_output)
output = tf.keras.layers.Dense(2, activation='softmax')(dropout)


# Build model
model = tf.keras.Model(inputs=[input_ids, attention_mask], outputs=output)


# Compile model
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=2e-5),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)


# Train the model
model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=10,
    verbose=2
)


# Inference function
def predict_sentiment(text, model, tokenizer, max_len=128):
    encodings = tokenizer(
        [text],
        max_length=max_len,
        padding='max_length',
        truncation=True,
        return_tensors='tf'
    )
    probs = model({'input_ids': encodings['input_ids'], 'attention_mask': encodings['attention_mask']}).numpy()
    prediction = np.argmax(probs, axis=-1)[0]
    print(f"Probabilities: {probs}")
    return "Positive" if prediction == 1 else "Negative"


# Test inference
test_text = "This is an awesome movie!"
result = predict_sentiment(test_text, model, tokenizer)
print(f"\\nText: {test_text}")
print(f"Predicted Sentiment: {result}")`


  const installCode = `pip install tensorflow transformers scikit-learn numpy`
  const runCode = `python bert_sentiment.py`


  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">🚀 Complete BERT Classification Code</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            This section provides the complete Python script for fine-tuning BERT for sentiment analysis 
            on movie reviews.
          </Box>


          <CodeBlock
            code={completeCode}
            language="python"
            title="Complete BERT Sentiment Analysis Implementation"
          />


          <Container header={<Header variant="h3">Running the Code</Header>}>
            <SpaceBetween size="m">
              <Box variant="p">Follow these steps to run the BERT model locally:</Box>


              <ol style={{ marginLeft: '20px' }}>
                <li>
                  <strong>Install Dependencies:</strong> Ensure you have TensorFlow, Transformers, and 
                  scikit-learn installed:
                  <CodeBlock code={installCode} language="bash" />
                </li>
                <li>
                  <strong>Save the Code:</strong> Copy the complete code into a file named <code>bert_sentiment.py</code>
                </li>
                <li>
                  <strong>Run the Script:</strong> Execute the script using Python:
                  <CodeBlock code={runCode} language="bash" />
                </li>
                <li>
                  <strong>Expected Output:</strong> The script will fine-tune BERT, display training progress, 
                  and output the sentiment for a test sentence.
                </li>
              </ol>
            </SpaceBetween>
          </Container>


          <Alert type="success" header="🔑 Code Features">
            <ul style={{ marginTop: '15px', marginLeft: '20px' }}>
              <li>
                <strong>Pre-trained BERT:</strong> Leverages <code>bert-base-uncased</code> for robust embeddings
              </li>
              <li>
                <strong>Fine-tuning:</strong> Adapts BERT to sentiment analysis with minimal code
              </li>
              <li>
                <strong>Efficient Data Pipeline:</strong> Uses TensorFlow datasets with batching and prefetching
              </li>
              <li>
                <strong>Interactive Inference:</strong> Allows testing custom sentences for sentiment prediction
              </li>
            </ul>
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}
