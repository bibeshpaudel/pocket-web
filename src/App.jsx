import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import JsonFormatter from './pages/JsonFormatter';
import XmlFormatter from './pages/XmlFormatter';
import QrGenerator from './pages/QrGenerator';
import ImageCompressor from './pages/ImageCompressor';
import PasswordGenerator from './pages/PasswordGenerator';
import MarkdownPreview from './pages/MarkdownPreview';
import Base64Converter from './pages/Base64Converter';
import SyntaxHighlighterTool from './pages/SyntaxHighlighter';
import TextCompare from './pages/TextCompare';
import CaseConverter from './pages/CaseConverter';
import WordCounter from './pages/WordCounter';
import RegexTester from './pages/RegexTester';
import HashGenerator from './pages/HashGenerator';
import AesEncrypt from './pages/AesEncrypt';
import UrlEncoder from './pages/UrlEncoder';
import IpLookup from './pages/IpLookup';
import ImageConverter from './pages/ImageConverter';
import SvgViewer from './pages/SvgViewer';
import LoremIpsum from './pages/LoremIpsum';
import UuidGenerator from './pages/UuidGenerator';
import UnitConverter from './pages/UnitConverter';
import TimestampConverter from './pages/TimestampConverter';
import TimezoneConverter from './pages/TimezoneConverter';
import MermaidEditor from './pages/MermaidEditor';
import PdfToText from './pages/PdfToText';
import PdfMerge from './pages/PdfMerge';
import CsvJsonConverter from './pages/CsvJsonConverter';
import CsvEditor from './pages/CsvEditor';
import CsvSqlTool from './pages/CsvSqlTool';
import JwtDebugger from './pages/JwtDebugger';
import WordToPdf from './pages/WordToPdf';




function App() {
  return (
      <HelmetProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="/xml-formatter" element={<XmlFormatter />} />
              <Route path="/qr-generator" element={<QrGenerator />} />
              <Route path="/image-compressor" element={<ImageCompressor />} />
              <Route path="/password-generator" element={<PasswordGenerator />} />
              <Route path="/markdown-preview" element={<MarkdownPreview />} />
              <Route path="/base64-converter" element={<Base64Converter />} />
              <Route path="/syntax-highlighter" element={<SyntaxHighlighterTool />} />
              <Route path="/text-compare" element={<TextCompare />} />
              <Route path="/case-converter" element={<CaseConverter />} />
              <Route path="/word-counter" element={<WordCounter />} />
              <Route path="/regex-tester" element={<RegexTester />} />
              <Route path="/hash-generator" element={<HashGenerator />} />
              <Route path="/aes-encrypt" element={<AesEncrypt />} />
              <Route path="/url-encoder" element={<UrlEncoder />} />
              <Route path="/ip-lookup" element={<IpLookup />} />
              <Route path="/image-converter" element={<ImageConverter />} />
              <Route path="/svg-viewer" element={<SvgViewer />} />
              <Route path="/lorem-ipsum" element={<LoremIpsum />} />
              <Route path="/uuid-generator" element={<UuidGenerator />} />
              <Route path="/unit-converter" element={<UnitConverter />} />
              <Route path="/timestamp-converter" element={<TimestampConverter />} />
              <Route path="/timezone-converter" element={<TimezoneConverter />} />
              <Route path="/mermaid-editor" element={<MermaidEditor />} />
              <Route path="/pdf-to-text" element={<PdfToText />} />
              <Route path="/pdf-merge" element={<PdfMerge />} />
              <Route path="/csv-json" element={<CsvJsonConverter />} />
              <Route path="/csv-editor" element={<CsvEditor />} />
              <Route path="/csv-sql" element={<CsvSqlTool />} />
              <Route path="/jwt-debugger" element={<JwtDebugger />} />
              <Route path="/word-to-pdf" element={<WordToPdf />} />


            </Routes>
          </Layout>
        </Router>
      </HelmetProvider>
  );
}

export default App;
